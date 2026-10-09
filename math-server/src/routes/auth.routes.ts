import { Router } from 'express'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../db'
import { requireAuth, signToken } from '../auth'
import { config } from '../config'
import { httpError } from '../httpError'
import { sendResetCode } from '../mailer'
import { generateCode, hashCode } from '../code'
import { CODE_RE, isValidEmail, isValidPassword, isValidUsername } from '../validate'

export const authRoutes = Router()

/** 找回密码单独叠加更严格的限流（5 次 / 10 分钟 / IP） */
const forgotLimiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: '操作过于频繁，请稍后再试' } },
})

/** 用户不存在时也做一次 bcrypt.compare，拉平响应时间（缓解时序侧信道枚举） */
const DUMMY_HASH = bcrypt.hashSync('timing-dummy', 10)

/** 找回密码统一响应文案：无论邮箱是否注册都返回它（防用户枚举） */
const FORGOT_OK_MSG = '如果该邮箱已注册，验证码已发送，请查收'

/* ---------- 注册 ---------- */
authRoutes.post('/register', async (req, res) => {
  const username = String(req.body?.username ?? '').trim().toUpperCase()
  const password = String(req.body?.password ?? '')
  const email = String(req.body?.email ?? '').trim().toLowerCase()

  if (!isValidUsername(username)) {
    throw httpError(400, 'INVALID_USERNAME', '用户名需为 2~20 位大写字母或数字')
  }
  if (!isValidPassword(password)) {
    throw httpError(400, 'INVALID_PASSWORD', '密码需为 8 位以上字母和数字的组合')
  }
  if (!isValidEmail(email)) {
    throw httpError(400, 'INVALID_EMAIL', '邮箱格式不正确')
  }

  const hash = await bcrypt.hash(password, config.bcryptRounds)
  try {
    const [r] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)',
      [username, hash, email]
    )
    const user = { id: r.insertId, username, email }
    const token = signToken({ uid: user.id, username })
    res.status(201).json({ token, user })
  } catch (e) {
    const err = e as { code?: string; message?: string }
    if (err.code === 'ER_DUP_ENTRY') {
      if (err.message?.includes('uk_users_email')) {
        throw httpError(409, 'EMAIL_TAKEN', '该邮箱已被注册')
      }
      throw httpError(409, 'USERNAME_TAKEN', '该用户名已被注册')
    }
    throw e
  }
})

/* ---------- 登录 ---------- */
authRoutes.post('/login', async (req, res) => {
  const username = String(req.body?.username ?? '').trim().toUpperCase()
  const password = String(req.body?.password ?? '')
  if (!username || !password) throw httpError(400, 'MISSING_FIELDS', '请输入用户名和密码')

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, username, email, password_hash FROM users WHERE username = ?',
    [username]
  )
  const row = rows[0]
  const ok = await bcrypt.compare(password, row ? String(row.password_hash) : DUMMY_HASH)
  if (!row || !ok) throw httpError(401, 'INVALID_CREDENTIALS', '用户名或密码不正确')

  const token = signToken({ uid: Number(row.id), username: String(row.username) })
  res.json({
    token,
    user: { id: Number(row.id), username: String(row.username), email: String(row.email) },
  })
})

/* ---------- 当前用户 ---------- */
authRoutes.get('/me', requireAuth, async (req, res) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, username, email, created_at AS createdAt FROM users WHERE id = ?',
    [req.user!.uid]
  )
  if (rows.length === 0) throw httpError(401, 'UNAUTHORIZED', '账号不存在，请重新登录')
  const u = rows[0]
  res.json({ user: { id: Number(u.id), username: String(u.username), email: String(u.email), createdAt: u.createdAt } })
})

/* ---------- 找回密码：发送验证码 ---------- */
authRoutes.post('/forgot', forgotLimiter, async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase()
  if (!isValidEmail(email)) throw httpError(400, 'INVALID_EMAIL', '邮箱格式不正确')

  const [users] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email])
  if (users.length === 0) {
    // 邮箱未注册：返回统一文案，不做任何事（防枚举）
    res.json({ message: FORGOT_OK_MSG })
    return
  }

  // 重发冷却（注意：已注册邮箱冷却期内会收到 429，存在轻微枚举面，本地项目可接受）
  const [latest] = await pool.query<RowDataPacket[]>(
    `SELECT TIMESTAMPDIFF(SECOND, created_at, NOW(3)) AS elapsed
     FROM password_resets WHERE email = ? ORDER BY id DESC LIMIT 1`,
    [email]
  )
  if (latest[0] && Number(latest[0].elapsed) < config.resetCodeCooldownSeconds) {
    throw httpError(429, 'RESEND_TOO_SOON', `发送太频繁，请 ${config.resetCodeCooldownSeconds} 秒后再试`)
  }

  // 作废旧码，生成新码
  await pool.query('UPDATE password_resets SET used = 1 WHERE email = ? AND used = 0', [email])
  const code = generateCode()
  const expiresAt = new Date(Date.now() + config.resetCodeTtlMinutes * 60_000)
  await pool.query('INSERT INTO password_resets (email, code_hash, expires_at) VALUES (?, ?, ?)', [
    email,
    hashCode(email, code),
    expiresAt,
  ])
  await sendResetCode(email, code)
  res.json({ message: FORGOT_OK_MSG })
})

/* ---------- 找回密码：验证码 + 新密码 ---------- */
authRoutes.post('/reset', async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase()
  const code = String(req.body?.code ?? '').trim()
  const newPassword = String(req.body?.newPassword ?? '')

  if (!isValidEmail(email)) throw httpError(400, 'INVALID_EMAIL', '邮箱格式不正确')
  if (!CODE_RE.test(code)) throw httpError(400, 'INVALID_OR_EXPIRED_CODE', '验证码不正确或已过期')
  if (!isValidPassword(newPassword)) {
    throw httpError(400, 'INVALID_PASSWORD', '密码需为 8 位以上字母和数字的组合')
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, code_hash, attempts, (expires_at > NOW(3)) AS unexpired
     FROM password_resets WHERE email = ? AND used = 0 ORDER BY id DESC LIMIT 1`,
    [email]
  )
  const row = rows[0]
  if (!row || !row.unexpired || Number(row.attempts) >= 5) {
    throw httpError(400, 'INVALID_OR_EXPIRED_CODE', '验证码不正确或已过期')
  }
  if (hashCode(email, code) !== row.code_hash) {
    // 错一次 attempts+1，累计 5 次锁死（防 6 位码爆破）
    await pool.query('UPDATE password_resets SET attempts = attempts + 1 WHERE id = ?', [row.id])
    throw httpError(400, 'INVALID_OR_EXPIRED_CODE', '验证码不正确或已过期')
  }

  const hash = await bcrypt.hash(newPassword, config.bcryptRounds)
  await pool.query('UPDATE users SET password_hash = ? WHERE email = ?', [hash, email])
  await pool.query('UPDATE password_resets SET used = 1 WHERE id = ?', [row.id])
  res.json({ message: '密码已重置，请使用新密码登录' })
})
