/* =========================================================
 * 输入校验 —— 与后端 math-server/src/validate.ts 同一套规则
 * 两边任何修改必须同步，并以需求为准：
 *   用户名：Unicode 文字 + 数字，NFC 后 2~20 个码点（保留大小写）
 *   密码：8~64 位，仅字母数字，且必须同时含字母和数字
 * ========================================================= */

export const USERNAME_RE = /^[\p{L}\p{N}]{2,20}$/u
export const PASSWORD_RE = /^[A-Za-z0-9]{8,64}$/
export const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export function normalizeUsername(u: string): string {
  return u.normalize('NFC')
}

export function isValidUsername(u: string): boolean {
  return USERNAME_RE.test(normalizeUsername(u))
}

export function isValidPassword(p: string): boolean {
  return PASSWORD_RE.test(p) && /[A-Za-z]/.test(p) && /\d/.test(p)
}

export function isValidEmail(e: string): boolean {
  return EMAIL_RE.test(e)
}

/** 以下返回中文字段级错误文案，空串表示通过 */

export function usernameError(u: string): string {
  if (!u) return '请输入用户名'
  if (!isValidUsername(u)) return '用户名需为 2~20 位文字或数字，不能包含空格或特殊符号'
  return ''
}

export function passwordError(p: string): string {
  if (!p) return '请输入密码'
  if (p.length < 8) return '密码至少 8 位'
  if (p.length > 64) return '密码最多 64 位'
  if (!PASSWORD_RE.test(p)) return '密码只能包含字母和数字'
  if (!/[A-Za-z]/.test(p) || !/\d/.test(p)) return '密码必须同时包含字母和数字'
  return ''
}

export function emailError(e: string): string {
  if (!e) return '请输入邮箱'
  if (!EMAIL_RE.test(e)) return '邮箱格式不正确'
  return ''
}
