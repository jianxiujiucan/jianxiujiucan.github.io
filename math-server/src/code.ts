import crypto from 'node:crypto'

/** 加密安全随机 6 位数字验证码 */
export function generateCode(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0')
}

/**
 * 存 sha256(email:code)：DB 泄露也拿不到明文验证码；
 * email 归一化小写后当盐。
 */
export function hashCode(email: string, code: string): string {
  return crypto.createHash('sha256').update(`${email.toLowerCase()}:${code}`).digest('hex')
}
