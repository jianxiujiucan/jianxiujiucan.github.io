import type { IncomingMessage, ServerResponse } from 'node:http'
import app from '../src/app'
import { initDb } from '../src/db'

/**
 * Vercel Serverless Function 入口（catch-all：/api/* 全部进入 Express）。
 * 冷启动时初始化一次数据库（建表幂等），同一实例复用结果。
 */
const ready = initDb()

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  await ready
  app(req, res)
}
