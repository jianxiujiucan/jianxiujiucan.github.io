import nodemailer, { type Transporter } from 'nodemailer'
import { config } from './config'

let transporter: Transporter | null = null

if (config.smtp.host && config.smtp.user && config.smtp.pass) {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
  })
  console.log('[mailer] SMTP 已配置，使用真实邮件发送')
} else {
  console.log('[mailer] SMTP 未配置，邮件内容将打印到控制台（开发模式）')
}

export async function sendResetCode(email: string, code: string): Promise<void> {
  const subject = '口算答题器 - 密码重置验证码'
  const text = `您的验证码是：${code}\n${config.resetCodeTtlMinutes} 分钟内有效，请勿泄露给他人。\n如果这不是您的操作，请忽略本邮件。`
  if (!transporter) {
    console.log('========== [mailer] 模拟发送邮件 ==========')
    console.log(`  To:      ${email}`)
    console.log(`  Subject: ${subject}`)
    console.log(`  Body:\n${text}`)
    console.log('===========================================')
    return
  }
  await transporter.sendMail({ from: config.smtp.from, to: email, subject, text })
}
