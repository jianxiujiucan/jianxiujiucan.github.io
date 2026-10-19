import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import { withDb } from '../db'
import { getConfig, type AppEnv } from '../env'
import { httpError } from '../httpError'
import { bodyOf } from '../body'
import { rateLimit } from '../rateLimit'
import { isValidPassword, isValidUsername, normalizeUsername } from '../validate'

export const adminRoutes = new Hono<AppEnv>()

/** 管理接口单独限流（10 次 / 10 分钟 / IP） */
const adminLimiter = rateLimit(10, 10 * 60_000)

/* ---------- 管理员重置用户密码 ----------
 * 家庭使用场景：用户忘记密码后联系管理员（家长），
 * 管理员在 /admin 页面用管理口令直接为其设置新密码。
 * 口令经 X-Admin-Token 头校验，不配置 ADMIN_TOKEN 则接口整体关闭。
 */
adminRoutes.post('/reset-password', adminLimiter, async (c) => {
  const expected = c.env.ADMIN_TOKEN
  const token = c.req.header('x-admin-token') ?? ''
  if (!expected || token !== expected) {
    throw httpError(403, 'FORBIDDEN', '管理口令不正确')
  }

  const body = await bodyOf(c)
  const username = normalizeUsername(String(body.username ?? '').trim())
  const newPassword = String(body.newPassword ?? '')

  if (!isValidUsername(username)) {
    throw httpError(400, 'INVALID_USERNAME', '用户名需为 2~20 位文字或数字，不能包含空格或特殊符号')
  }
  if (!isValidPassword(newPassword)) {
    throw httpError(400, 'INVALID_PASSWORD', '密码需为 8 位以上字母和数字的组合')
  }

  const hash = await bcrypt.hash(newPassword, getConfig(c.env).bcryptRounds)
  // 大小写不敏感定位用户，返回库里真实的大小写形式
  const realUsername = await withDb(c.env, async (db) => {
    const r = await db.query<{ username: string }>(
      'UPDATE users SET password_hash = $1 WHERE LOWER(username) = LOWER($2) RETURNING username',
      [hash, username]
    )
    return r.rows[0]?.username as string | undefined
  })
  if (!realUsername) throw httpError(404, 'USER_NOT_FOUND', '该用户名不存在')
  return c.json({ message: `已将 ${realUsername} 的密码重置为新密码` })
})
