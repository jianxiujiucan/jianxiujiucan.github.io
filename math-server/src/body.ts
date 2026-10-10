import type { Context } from 'hono'

/** 解析 JSON body；非法/空 body 返回 {}（交给字段校验报 400，而不是 500） */
export async function bodyOf(c: Context): Promise<Record<string, unknown>> {
  try {
    const b = (await c.req.json()) as Record<string, unknown> | null
    return b ?? {}
  } catch {
    return {}
  }
}
