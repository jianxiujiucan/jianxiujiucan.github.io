import type { Context, Next } from 'hono'
import { httpError } from './httpError'

interface Bucket {
  count: number
  resetAt: number
}

/**
 * 简易固定窗口限流中间件：limit 次 / windowMs。
 * 注意：计数 Map 必须在工厂闭包内（每个限流器实例独立计数），
 * 且单 isolate 内存计数在 Workers 多实例下不完全精确，本项目规模可接受。
 */
export function rateLimit(limit: number, windowMs: number) {
  const buckets = new Map<string, Bucket>()
  return async (c: Context, next: Next): Promise<void> => {
    const ip =
      c.req.header('cf-connecting-ip') ??
      c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
      'unknown'
    const key = `${c.req.path}:${ip}`
    const now = Date.now()
    let b = buckets.get(key)
    if (!b || b.resetAt <= now) {
      b = { count: 0, resetAt: now + windowMs }
      buckets.set(key, b)
    }
    b.count++
    if (buckets.size > 5000) buckets.clear() // 防内存膨胀
    if (b.count > limit) {
      throw httpError(429, 'RATE_LIMITED', '请求过于频繁，请稍后再试')
    }
    await next()
  }
}
