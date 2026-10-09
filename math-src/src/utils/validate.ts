/* =========================================================
 * 输入校验 —— 与后端 math-server/src/validate.ts 同一套规则
 * 两边任何修改必须同步，并以需求为准：
 *   用户名：26 个大写字母 + 数字，2~20 位
 *   密码：8~64 位，仅字母数字，且必须同时含字母和数字
 * ========================================================= */

export const USERNAME_RE = /^[A-Z0-9]{2,20}$/
export const PASSWORD_RE = /^[A-Za-z0-9]{8,64}$/
export const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export function isValidUsername(u: string): boolean {
  return USERNAME_RE.test(u)
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
  if (!USERNAME_RE.test(u)) return '用户名需为 2~20 位大写字母或数字'
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
