import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import { withDb } from '../db'
import { requireAuth, signToken } from '../auth'
import { getConfig, type AppEnv } from '../env'
import { httpError } from '../httpError'
import { bodyOf } from '../body'
import { isValidEmail, isValidPassword, isValidUsername } from '../validate'
import type { IdRow, UserAuthRow, UserPublicRow } from '../types'

export const authRoutes = new Hono<AppEnv>()

// Workers 运行时 bcryptjs 探测不到随机源，显式用 WebCrypto 兜底
bcrypt.setRandomFallback((len: number) => {
  const buf = new Uint8Array(len)
  crypto.getRandomValues(buf)
  return [...buf]
})

/**
 * 用户不存在时也做一次 bcrypt.compare，拉平响应时间（缓解时序侧信道枚举）。
 * 注意必须懒计算：Workers 禁止在全局作用域生成随机值（bcrypt 加盐需要随机数）。
 */
let dummyHash: string | null = null
function getDummyHash(): string {
  dummyHash ??= bcrypt.hashSync('timing-dummy', 10)
  return dummyHash
}

/* ---------- 注册 ---------- */
authRoutes.post('/register', async (c) => {
  const body = await bodyOf(c)
  // 用户名原样存储（不再转大写）；唯一性由 LOWER(username) 唯一索引保证大小写不敏感
  const username = String(body.username ?? '').trim()
  const password = String(body.password ?? '')
  const email = String(body.email ?? '').trim().toLowerCase()
  const cfg = getConfig(c.env)

  if (!isValidUsername(username)) {
    throw httpError(400, 'INVALID_USERNAME', '用户名需为 2~20 位字母或数字')
  }
  if (!isValidPassword(password)) {
    throw httpError(400, 'INVALID_PASSWORD', '密码需为 8 位以上字母和数字的组合')
  }
  if (!isValidEmail(email)) {
    throw httpError(400, 'INVALID_EMAIL', '邮箱格式不正确')
  }

  const hash = await bcrypt.hash(password, cfg.bcryptRounds)
  try {
    const id = await withDb(c.env, async (db) => {
      const { rows } = await db.query<IdRow>(
        'INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id',
        [username, hash, email]
      )
      return rows[0].id
    })
    const user = { id, username, email }
    const token = await signToken({ uid: id, username }, cfg.jwtSecret, cfg.jwtExpiresIn)
    return c.json({ token, user }, 201)
  } catch (e) {
    // Postgres 唯一约束冲突（列唯一 + LOWER 表达式唯一索引都算重名）
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

/* ---------- 登录（用户名大小写不敏感） ---------- */
authRoutes.post('/login', async (c) => {
  const body = await bodyOf(c)
  const username = String(body.username ?? '').trim()
  const password = String(body.password ?? '')
  if (!username || !password) throw httpError(400, 'MISSING_FIELDS', '请输入用户名和密码')

  const row = await withDb(c.env, async (db) => {
    const { rows } = await db.query<UserAuthRow>(
      'SELECT id, username, email, password_hash FROM users WHERE LOWER(username) = LOWER($1)',
      [username]
    )
    return rows[0]
  })
  const ok = await bcrypt.compare(password, row ? row.password_hash : getDummyHash())
  if (!row || !ok) throw httpError(401, 'INVALID_CREDENTIALS', '用户名或密码不正确')

  const cfg = getConfig(c.env)
  const token = await signToken({ uid: row.id, username: row.username }, cfg.jwtSecret, cfg.jwtExpiresIn)
  return c.json({ token, user: { id: row.id, username: row.username, email: row.email } })
})

/* ---------- 当前用户 ---------- */
authRoutes.get('/me', requireAuth, async (c) => {
  const row = await withDb(c.env, async (db) => {
    const { rows } = await db.query<UserPublicRow>(
      'SELECT id, username, email, created_at AS "createdAt" FROM users WHERE id = $1',
      [c.get('user').uid]
    )
    return rows[0]
  })
  if (!row) throw httpError(401, 'UNAUTHORIZED', '账号不存在，请重新登录')
  return c.json({ user: row })
})
