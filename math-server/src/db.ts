import mysql from 'mysql2/promise'
import { config } from './config'
import { schemaStatements } from './schema'

export let pool: mysql.Pool

/** 启动时自动建库建表（幂等），免去手动 CREATE DATABASE */
export async function initDb(): Promise<void> {
  // 库名要拼进 SQL（CREATE DATABASE 不支持占位符），先白名单校验防注入
  if (!/^[A-Za-z0-9_]+$/.test(config.db.database)) {
    throw new Error(`非法数据库名: ${config.db.database}`)
  }

  // 1) 不带 database 连接，先建库
  const admin = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
  })
  await admin.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\`
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  )
  await admin.end()

  // 2) 业务连接池
  pool = mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    connectionLimit: 10,
    timezone: '+08:00', // DATETIME 读写按本地时区
    dateStrings: true, // DATETIME 以字符串返回，避免 JSON 序列化成 UTC 造成时区偏差
    charset: 'utf8mb4',
  })

  // 3) 逐条执行 DDL
  for (const ddl of schemaStatements) {
    await pool.query(ddl)
  }
  console.log('[db] database & tables ready')
}
