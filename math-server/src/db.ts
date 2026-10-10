import pg from 'pg'
import { schemaStatements } from './schema'
import type { Bindings } from './env'

// timestamptz(1184) / timestamp(1114) 返回原始字符串（带时区偏移），
// 前端负责按浏览器本地时区展示
pg.types.setTypeParser(1184, (v: string) => v)
pg.types.setTypeParser(1114, (v: string) => v)

let ready: Promise<void> | null = null

/**
 * 每次请求新建连接（用完即关）。
 * serverless + Hyperdrive 本地代理会快速关闭空闲连接，连接池复用
 * 会拿到已断开的连接导致请求挂起；单请求单连接最稳妥，
 * 上游由 Hyperdrive / Supabase Pooler 负责真正的池化。
 */
export async function withDb<T>(env: Bindings, fn: (client: pg.Client) => Promise<T>): Promise<T> {
  const client = new pg.Client({
    connectionString: env.HYPERDRIVE?.connectionString ?? env.DATABASE_URL,
    // Hyperdrive 本地端点无需 TLS；直连 Supabase 需要
    ssl: env.HYPERDRIVE ? false : { rejectUnauthorized: false },
  })
  await client.connect()
  try {
    return await fn(client)
  } finally {
    await client.end().catch(() => {})
  }
}

/** 每个实例首次请求时执行一次幂等建表 */
export function ensureDb(env: Bindings): Promise<void> {
  ready ??= withDb(env, async (db) => {
    for (const ddl of schemaStatements) {
      await db.query(ddl)
    }
    console.log('[db] tables ready')
  })
  return ready
}
