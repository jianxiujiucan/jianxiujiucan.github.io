import app from './app'
import { config } from './config'
import { initDb } from './db'

// 本地开发入口：初始化数据库后监听端口
const port = config.port
initDb()
  .then(() => {
    app.listen(port, () => console.log(`[server] listening on http://localhost:${port}`))
  })
  .catch((err: unknown) => {
    console.error(
      '[db] 初始化失败（请检查 .env 的 DATABASE_URL 是否正确、网络能否连通）:',
      err instanceof Error ? err.message : err
    )
    process.exit(1)
  })
