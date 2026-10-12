import dotenv from 'dotenv'
dotenv.config({ path: '.dev.vars' })

import { serve } from '@hono/node-server'
import app from './worker'
import type { Bindings } from './env'

/**
 * 本地开发入口（Node）：Hono 应用经 @hono/node-server 托管，
 * pg 用 DATABASE_URL 直连 Supabase（本地 Node 的 TLS 正常）。
 * 与 Workers 入口共用同一个 app，路由/逻辑零差异。
 */
const bindings = { ...process.env } as unknown as Bindings

const port = Number(process.env.PORT ?? 3000)
serve({ fetch: (req) => app.fetch(req, bindings), port }, (info) => {
  console.log(`[server] listening on http://localhost:${info.port}`)
})
