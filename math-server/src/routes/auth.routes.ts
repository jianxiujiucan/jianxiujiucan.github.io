import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import { getPool } from '../db'
import { requireAuth, signToken } from '../auth'
import { getConfig, type AppEnv } from '../env'
import { httpError } from '../httpError'
import { sendResetCode } from '../mailer'
import { generateCode, hashCode } from '../code'
import { bodyOf } from '../body'
import { rateLimit } from '../rateLimit'
import { CODE_RE, isValidEmail, isValidPassword, isValidUsername } from '../validate'
import type { ElapsedRow, IdRow, ResetRow, UserAuthRow, UserPublicRow } from '../types'

export const authRoutes = new Hono<AppEnv>()

// Workers 运行时 bcryptjs 探测不到随机源，显式用 WebCrypto 兜底
bcrypt.setRandomFallback((len: number) => {
  const buf = new Uint8Array(len)
  crypto.getRandomValues(buf)
  return [...buf]
})

/** 找回密码单独叠加更严格的限流（5 次 / 10 分钟 / IP） */
const forgotLimiter = rateLimit(5, 10 * 60_000)

/**
 * 用户不存在时也做一次 bcrypt.compare，拉平响应时间（缓解时序侧信道枚举）。
 * 注意必须懒计算：Workers 禁止在全局作用域生成随机值（bcrypt 加盐需要随机数）。
 */
let dummyHash: string | null = null
function getDummyHash(): string {
  dummyHash ??= bcrypt.hashSync('timing-dummy', 10)
  return dummyHash
}

/** 找回密码统一响应文案：无论邮箱是否注册都返回它（防用户枚举） */
const FORGOT_OK_MSG = '如果该邮箱已注册，验证码已发送，请查收'

/* ---------- 注册 ---------- */
authRoutes.post('/register', async (c) => {
  const body = await bodyOf(c)
  const username = String(body.username ?? '').trim().toUpperCase()
  const password = String(body.password ?? '')
  const email = String(body.email ?? '').trim().toLowerCase()
  const cfg = getConfig(c.env)

  if (!isValidUsername(username)) {
    throw httpError(400, 'INVALID_USERNAME', '用户名需为 2~20 位大写字母或数字')
  }
  if (!isValidPassword(password)) {
    throw httpError(400, 'INVALID_PASSWORD', '密码需为 8 位以上字母和数字的组合')
  }
  if (!isValidEmail(email)) {
    throw httpError(400, 'INVALID_EMAIL', '邮箱格式不正确')
  }

  const hash = await bcrypt.hash(password, cfg.bcryptRounds)
  try {
    const { rows } = await getPool(c.env).query<IdRow>(
      'INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id',
      [username, hash, email]
    )
    const user = { id: rows[0].id, username, email }
    const token = await signToken({ uid: user.id, username }, cfg.jwtSecret, cfg.jwtExpiresIn)
    return c.json({ token, user }, 201)
  } catch (e) {
    // Postgres 唯一约束冲突
    const err = e as { code?: string; constraint?: string }
    if (err.code === '23505') {
      if (err.constraint === 'uk_users_email') {
        throw httpError(409, 'EMAIL_TAKEN', '该邮箱已被注册')
      }
      throw httpError(409, 'USERNAME_TAKEN', '该用户名已被注册')
    }
    throw e
  }
})

/* ---------- 登录 ---------- */
authRoutes.post('/login', async (c) => {
  const body = await bodyOf(c)
  const username = String(body.username ?? '').trim().toUpperCase()
  const password = String(body.password ?? '')
  if (!username || !password) throw httpError(400, 'MISSING_FIELDS', '请输入用户名和密码')

  const { rows } = await getPool(c.env).query<UserAuthRow>(
    'SELECT id, username, email, password_hash FROM users WHERE username = $1',
    [username]
  )
  const row = rows[0]
  const ok = await bcrypt.compare(password, row ? row.password_hash : getDummyHash())
  if (!row || !ok) throw httpError(401, 'INVALID_CREDENTIALS', '用户名或密码不正确')

  const cfg = getConfig(c.env)
  const token = await signToken({ uid: row.id, username: row.username }, cfg.jwtSecret, cfg.jwtExpiresIn)
  return c.json({ token, user: { id: row.id, username: row.username, email: row.email } })
})

/* ---------- 当前用户 ---------- */
authRoutes.get('/me', requireAuth, async (c) => {
  const { rows } = await getPool(c.env).query<UserPublicRow>(
    'SELECT id, username, email, created_at AS "createdAt" FROM users WHERE id = $1',
    [c.get('user').uid]
  )
  if (rows.length === 0) throw httpError(401, 'UNAUTHORIZED', '账号不存在，请重新登录')
  return c.json({ user: rows[0] })
})

/* ---------- 找回密码：发送验证码 ---------- */
authRoutes.post('/forgot', forgotLimiter, async (c) => {
  const body = await bodyOf(c)
  const email = String(body.email ?? '').trim().toLowerCase()
  if (!isValidEmail(email)) throw httpError(400, 'INVALID_EMAIL', '邮箱格式不正确')

  const pool = getPool(c.env)
  const { rows: users } = await pool.query<IdRow>('SELECT id FROM users WHERE email = $1', [email])
  if (users.length === 0) {
    // 邮箱未注册：返回统一文案，不做任何事（防枚举）
    return c.json({ message: FORGOT_OK_MSG })
  }

  // 重发冷却（注意：已注册邮箱冷却期内会收到 429，存在轻微枚举面，本地项目可接受）
  const cfg = getConfig(c.env)
  const { rows: latest } = await pool.query<ElapsedRow>(
    `SELECT EXTRACT(EPOCH FROM (now() - created_at)) AS elapsed
     FROM password_resets WHERE email = $1 ORDER BY id DESC LIMIT 1`,
    [email]
  )
  if (latest[0] && Number(latest[0].elapsed) < cfg.resetCodeCooldownSeconds) {
    throw httpError(429, 'RESEND_TOO_SOON', `发送太频繁，请 ${cfg.resetCodeCooldownSeconds} 秒后再试`)
  }

  // 作废旧码，生成新码
  await pool.query('UPDATE password_resets SET used = TRUE WHERE email = $1 AND used = FALSE', [email])
  const code = generateCode()
  const expiresAt = new Date(Date.now() + cfg.resetCodeTtlMinutes * 60_000)
  await pool.query(
    'INSERT INTO password_resets (email, code_hash, expires_at) VALUES ($1, $2, $3)',
    [email, await hashCode(email, code), expiresAt]
  )
  await sendResetCode(c.env, email, code)
  return c.json({ message: FORGOT_OK_MSG })
})

/* ---------- 找回密码：验证码 + 新密码 ---------- */
authRoutes.post('/reset', async (c) => {
  const body = await bodyOf(c)
  const email = String(body.email ?? '').trim().toLowerCase()
  const code = String(body.code ?? '').trim()
  const newPassword = String(body.newPassword ?? '')

  if (!isValidEmail(email)) throw httpError(400, 'INVALID_EMAIL', '邮箱格式不正确')
  if (!CODE_RE.test(code)) throw httpError(400, 'INVALID_OR_EXPIRED_CODE', '验证码不正确或已过期')
  if (!isValidPassword(newPassword)) {
    throw httpError(400, 'INVALID_PASSWORD', '密码需为 8 位以上字母和数字的组合')
  }

  const pool = getPool(c.env)
  const { rows } = await pool.query<ResetRow>(
    `SELECT id, code_hash, attempts, (expires_at > now()) AS unexpired
     FROM password_resets WHERE email = $1 AND used = FALSE ORDER BY id DESC LIMIT 1`,
    [email]
  )
  const row = rows[0]
  if (!row || !row.unexpired || row.attempts >= 5) {
    throw httpError(400, 'INVALID_OR_EXPIRED_CODE', '验证码不正确或已过期')
  }
  if ((await hashCode(email, code)) !== row.code_hash) {
    // 错一次 attempts+1，累计 5 次锁死（防 6 位码爆破）
    await pool.query('UPDATE password_resets SET attempts = attempts + 1 WHERE id = $1', [row.id])
    throw httpError(400, 'INVALID_OR_EXPIRED_CODE', '验证码不正确或已过期')
  }

  const hash = await bcrypt.hash(newPassword, getConfig(c.env).bcryptRounds)
  await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, email])
  await pool.query('UPDATE password_resets SET used = TRUE WHERE id = $1', [row.id])
  return c.json({ message: '密码已重置，请使用新密码登录' })
})
