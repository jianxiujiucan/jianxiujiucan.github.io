import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { config } from './config'
import { initDb } from './db'
import { authRoutes } from './routes/auth.routes'
import { quizRoutes } from './routes/quiz.routes'
import { profileRoutes } from './routes/profile.routes'
import { leaderboardRoutes } from './routes/leaderboard.routes'
import { HttpError } from './httpError'

const app = express()
app.disable('x-powered-by')

// CORS：白名单精确匹配；无 origin（curl/Postman/同源）放行
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || config.corsOrigins.includes(origin)) return cb(null, true)
      cb(new Error('CORS_DENIED'))
    },
  })
)

app.use(express.json({ limit: '100kb' }))

const apiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: '请求过于频繁，请稍后再试' } },
})
const authLimiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: '操作过于频繁，请稍后再试' } },
})

app.use('/api', apiLimiter)
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/quiz-sessions', quizRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// 404
app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: '接口不存在' } })
})

// 统一错误处理（Express 5：同步 throw 与 Promise rejection 都会进入这里）
app.use(
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err instanceof HttpError) {
      res.status(err.status).json({ error: { code: err.code, message: err.message } })
      return
    }
    if (err instanceof Error && err.message === 'CORS_DENIED') {
      res.status(403).json({ error: { code: 'CORS_DENIED', message: '来源不被允许' } })
      return
    }
    console.error('[error]', err)
    res.status(500).json({ error: { code: 'INTERNAL', message: '服务器内部错误' } })
  }
)

const port = config.port
initDb()
  .then(() => {
    app.listen(port, () => console.log(`[server] listening on http://localhost:${port}`))
  })
  .catch((err: unknown) => {
    console.error(
      '[db] 初始化失败（请确认 MySQL 已启动且 .env 配置正确）:',
      err instanceof Error ? err.message : err
    )
    process.exit(1)
  })
