/* 验证码生成与哈希 —— WebCrypto 实现（Workers/Node 通用） */

/** 加密安全随机 6 位数字验证码 */
export function generateCode(): string {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return (buf[0] % 1_000_000).toString().padStart(6, '0')
}

/**
 * 存 sha256(email:code)：DB 泄露也拿不到明文验证码；
 * email 归一化小写后当盐。
 */
export async function hashCode(email: string, code: string): Promise<string> {
  const data = new TextEncoder().encode(`${email.toLowerCase()}:${code}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
