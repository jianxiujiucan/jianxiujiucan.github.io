import pg from 'pg'
import { config } from './config'
import { schemaStatements } from './schema'

// timestamptz(1184) / timestamp(1114) 返回原始字符串，
// 避免转成 JS Date 再 JSON 序列化成 UTC 造成时区偏差
pg.types.setTypeParser(1184, (v: string) => v)
pg.types.setTypeParser(1114, (v: string) => v)

export let pool: pg.Pool

/**
 * 启动时自动建表（CREATE TABLE IF NOT EXISTS，幂等）。
 * 数据库本身由 Supabase 提供（默认 postgres 库），无需也无法在连接内建库。
 */
export async function initDb(): Promise<void> {
  pool = new pg.Pool({
    connectionString: config.databaseUrl,
    ssl: config.dbSsl ? { rejectUnauthorized: false } : undefined,
    max: 10,
  })
  // 每个连接的会话时区固定为东八区，created_at 读写与前端展示一致
  pool.on('connect', (client) => {
    void client.query("SET TIME ZONE 'Asia/Shanghai'").catch(() => {})
  })
  for (const ddl of schemaStatements) {
    await pool.query(ddl)
  }
  console.log('[db] tables ready')
}
