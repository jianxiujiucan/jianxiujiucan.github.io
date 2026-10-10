import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { getConfig, type AppEnv } from './env'
import { ensureDb } from './db'
import { HttpError } from './httpError'
import { rateLimit } from './rateLimit'
import { authRoutes } from './routes/auth.routes'
import { quizRoutes } from './routes/quiz.routes'
import { profileRoutes } from './routes/profile.routes'
import { leaderboardRoutes } from './routes/leaderboard.routes'
import { adminRoutes } from './routes/admin.routes'

const app = new Hono<AppEnv>()

// 每个 isolate 首次请求前完成幂等建表（之后命中缓存，开销为零）
app.use('*', async (c, next) => {
  await ensureDb(c.env)
  await next()
})

// CORS：白名单精确匹配；无 origin（curl/同源）放行
app.use('*', async (c, next) =>
  cors({
    origin: (origin) => {
      const list = getConfig(c.env).corsOrigins
      return !origin || list.includes(origin) ? origin : null
    },
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  })(c, next)
)

app.use('/api/*', rateLimit(120, 60_000))
app.use('/api/auth/*', rateLimit(20, 10 * 60_000))

app.route('/api/auth', authRoutes)
app.route('/api/quiz-sessions', quizRoutes)
app.route('/api/profile', profileRoutes)
app.route('/api/leaderboard', leaderboardRoutes)
app.route('/api/admin', adminRoutes)
app.get('/api/health', (c) => c.json({ ok: true }))

// 404
app.notFound((c) => c.json({ error: { code: 'NOT_FOUND', message: '接口不存在' } }, 404))

// 统一错误处理
app.onError((err, c) => {
  if (err instanceof HttpError) {
    return c.json({ error: { code: err.code, message: err.message } }, err.status as ContentfulStatusCode)
  }
  console.error('[error]', err)
  return c.json({ error: { code: 'INTERNAL', message: '服务器内部错误' } }, 500)
})

// Cloudflare Workers 入口（Hono 应用即 fetch handler）
export default app
