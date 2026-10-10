import { getConfig, type Bindings } from './env'
import { httpError } from './httpError'

/**
 * 发送找回密码验证码。
 * Workers 不支持 SMTP 协议，走 Brevo HTTP API；
 * 未配置 BREVO_API_KEY 时打印到控制台/日志（本地开发与应急排障用，
 * 线上可用 `wrangler tail` 查看）。
 */
export async function sendResetCode(env: Bindings, email: string, code: string): Promise<void> {
  const cfg = getConfig(env)
  const subject = '口算答题器 - 密码重置验证码'
  const text = `您的验证码是：${code}\n${cfg.resetCodeTtlMinutes} 分钟内有效，请勿泄露给他人。\n如果这不是您的操作，请忽略本邮件。`

  if (!env.BREVO_API_KEY) {
    console.log('========== [mailer] 模拟发送邮件 ==========')
    console.log(`  To:      ${email}`)
    console.log(`  Subject: ${subject}`)
    console.log(`  Body:\n${text}`)
    console.log('===========================================')
    return
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: env.BREVO_FROM ?? '', name: '口算答题器' },
      to: [{ email }],
      subject,
      textContent: text,
    }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    console.error('[mailer] Brevo 发送失败', res.status, detail)
    throw httpError(500, 'MAIL_FAILED', '验证码发送失败，请稍后再试')
  }
}
