import jwt from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'
import { config } from './config'
import { httpError } from './httpError'

export interface AuthPayload {
  uid: number
  username: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as jwt.SignOptions)
}

/** requireAuth：Express 5 中同步 throw 会自动进入错误处理中间件 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) throw httpError(401, 'UNAUTHORIZED', '请先登录')
  try {
    req.user = jwt.verify(token, config.jwtSecret) as AuthPayload
    next()
  } catch {
    throw httpError(401, 'UNAUTHORIZED', '登录已过期，请重新登录')
  }
}
