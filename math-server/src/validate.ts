/* =========================================================
 * 输入校验 —— 与前端 math-src/src/utils/validate.ts 同一套规则
 * 两边任何修改必须同步，并以需求为准：
 *   用户名：26 个大写字母 + 数字，2~20 位
 *   密码：8~64 位，仅字母数字，且必须同时含字母和数字
 *   邮箱：常规格式
 * ========================================================= */

import type { QuizConfigDto } from './types'
import { OP_TYPES } from './types'

export const USERNAME_RE = /^[A-Z0-9]{2,20}$/
export const PASSWORD_RE = /^[A-Za-z0-9]{8,64}$/
export const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
export const CODE_RE = /^\d{6}$/

export function isValidUsername(u: string): boolean {
  return USERNAME_RE.test(u)
}

export function isValidPassword(p: string): boolean {
  return PASSWORD_RE.test(p) && /[A-Za-z]/.test(p) && /\d/.test(p)
}

export function isValidEmail(e: string): boolean {
  return EMAIL_RE.test(e)
}

const COUNTS = [10, 20, 30, 50, 100]
const RANGES = [10, 20, 100]
const OPERANDS = [2, 3]

export function isValidConfig(c: unknown): c is QuizConfigDto {
  const cfg = c as QuizConfigDto
  return (
    !!cfg &&
    COUNTS.includes(cfg.count) &&
    (OP_TYPES as readonly string[]).includes(cfg.opType) &&
    RANGES.includes(cfg.range) &&
    OPERANDS.includes(cfg.operands) &&
    typeof cfg.carry === 'boolean'
  )
}
