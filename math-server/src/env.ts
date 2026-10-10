/* =========================================================
 * Cloudflare Workers 绑定与环境配置
 * 生产密钥用 `wrangler secret put` 设置；本地开发放 .dev.vars（gitignored）；
 * 非机密默认值放 wrangler.toml 的 [vars]。
 * ========================================================= */

export interface Bindings {
  DATABASE_URL: string
  /** Hyperdrive 绑定（生产环境；pg 经它连接 Postgres，本地端点无 TLS） */
  HYPERDRIVE?: { connectionString: string }
  JWT_SECRET?: string
  JWT_EXPIRES_IN?: string
  BCRYPT_ROUNDS?: string
  CORS_ORIGINS?: string
  BREVO_API_KEY?: string
  /** Brevo 已验证发件人邮箱 */
  BREVO_FROM?: string
  RESET_CODE_TTL_MINUTES?: string
  RESET_CODE_RESEND_COOLDOWN_SECONDS?: string
}

import type { Context } from 'hono'
import type { AuthPayload } from './auth'

/** Hono 应用环境：Bindings 为 Workers 绑定，Variables 为中间件注入（登录用户） */
export type AppEnv = {
  Bindings: Bindings
  Variables: { user: AuthPayload }
}

export type AppContext = Context<AppEnv>

export function getConfig(env: Bindings) {
  return {
    databaseUrl: env.DATABASE_URL ?? '',
    jwtSecret: env.JWT_SECRET ?? 'dev-only-secret-change-me',
    jwtExpiresIn: env.JWT_EXPIRES_IN ?? '7d',
    bcryptRounds: Number(env.BCRYPT_ROUNDS ?? 10),
    corsOrigins: (
      env.CORS_ORIGINS ??
      'https://jianxiujiucan.github.io,http://localhost:5173,http://127.0.0.1:5173'
    )
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    resetCodeTtlMinutes: Number(env.RESET_CODE_TTL_MINUTES ?? 10),
    resetCodeCooldownSeconds: Number(env.RESET_CODE_RESEND_COOLDOWN_SECONDS ?? 60),
  }
}
