import { SignJWT, jwtVerify } from 'jose'
import type { Next } from 'hono'
import { getConfig, type AppContext } from './env'
import { httpError } from './httpError'

export interface AuthPayload {
  uid: number
  username: string
}

const enc = new TextEncoder()

export function signToken(payload: AuthPayload, secret: string, expiresIn: string): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn) // jose 支持 '7d' 等时长字符串
    .sign(enc.encode(secret))
}

export async function verifyToken(token: string, secret: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, enc.encode(secret))
    return payload as unknown as AuthPayload
  } catch {
    return null
  }
}

/** 登录态中间件：校验 Bearer token，注入 c.get('user') */
export async function requireAuth(c: AppContext, next: Next): Promise<void> {
  const header = c.req.header('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) throw httpError(401, 'UNAUTHORIZED', '请先登录')
  const payload = await verifyToken(token, getConfig(c.env).jwtSecret)
  if (!payload) throw httpError(401, 'UNAUTHORIZED', '登录已过期，请重新登录')
  c.set('user', payload)
  await next()
}
