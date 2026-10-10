import pg from 'pg'
import { schemaStatements } from './schema'
import type { Bindings } from './env'

// timestamptz(1184) / timestamp(1114) 返回原始字符串（带时区偏移），
// 前端负责按浏览器本地时区展示（Supavisor 事务池不支持会话级时区设置）
pg.types.setTypeParser(1184, (v: string) => v)
pg.types.setTypeParser(1114, (v: string) => v)

let pool: pg.Pool | null = null
let ready: Promise<void> | null = null

/**
 * 每个实例内复用一个连接池。
 * 生产（Workers）：走 Hyperdrive 绑定的本地端点（无需 TLS；
 * workerd 的 node:tls 不支持 pg 的 SSL 升级，直连 Postgres 在 Workers 上不可行）。
 * 本地开发（Node）：用 DATABASE_URL 直连 Supabase（SSL 必需）。
 */
export function getPool(env: Bindings): pg.Pool {
  if (!pool) {
    pool = new pg.Pool({
      connectionString: env.HYPERDRIVE?.connectionString ?? env.DATABASE_URL,
      ssl: env.HYPERDRIVE ? false : { rejectUnauthorized: false },
      max: 3, // serverless：单实例并发有限，小池即可
    })
  }
  return pool
}

/** 每个实例首次请求时执行一次幂等建表 */
export function ensureDb(env: Bindings): Promise<void> {
  ready ??= (async () => {
    for (const ddl of schemaStatements) {
      await getPool(env).query(ddl)
    }
    console.log('[db] tables ready')
  })()
  return ready
}
