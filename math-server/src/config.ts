import 'dotenv/config'

function withDevFallback(name: string, fallback: string): string {
  const v = process.env[name]
  if (!v) {
    if (name === 'JWT_SECRET' || name === 'DB_PASSWORD') {
      console.warn(`[config] ${name} 未配置，使用开发默认值（仅限本地）`)
    }
    return fallback
  }
  return v
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  db: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: withDevFallback('DB_PASSWORD', ''),
    database: process.env.DB_NAME ?? 'math_quiz',
  },
  jwtSecret: withDevFallback('JWT_SECRET', 'dev-only-secret-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 10),
  corsOrigins: (process.env.CORS_ORIGINS ??
    'https://jianxiujiucan.github.io,http://localhost:5173,http://127.0.0.1:5173')
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
