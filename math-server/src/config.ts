import 'dotenv/config'

function withDevFallback(name: string, fallback: string): string {
  const v = process.env[name]
  if (!v) {
    console.warn(`[config] ${name} 未配置，使用开发默认值（仅限本地）`)
    return fallback
  }
  return v
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  /**
   * Postgres 连接串。推荐 Supabase Transaction Pooler（6543 端口，serverless 友好）：
   * postgresql://postgres.<project-ref>:<密码>@aws-x-<region>.pooler.supabase.com:6543/postgres
   */
  databaseUrl: withDevFallback('DATABASE_URL', ''),
  /** Supabase 要求 SSL；本地直连自建 Postgres 时设 DB_SSL=false */
  dbSsl: (process.env.DB_SSL ?? 'true') !== 'false',
  jwtSecret: withDevFallback('JWT_SECRET', 'dev-only-secret-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 10),
  corsOrigins: (
    process.env.CORS_ORIGINS ??
    'https://jianxiujiucan.github.io,http://localhost:5173,http://127.0.0.1:5173'
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  smtp: {
    host: process.env.SMTP_HOST ?? '',
    port: Number(process.env.SMTP_PORT ?? 465),
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER ?? '',
  },
  resetCodeTtlMinutes: Number(process.env.RESET_CODE_TTL_MINUTES ?? 10),
  resetCodeCooldownSeconds: Number(process.env.RESET_CODE_RESEND_COOLDOWN_SECONDS ?? 60),
}
