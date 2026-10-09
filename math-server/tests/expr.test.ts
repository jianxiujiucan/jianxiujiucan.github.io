import { describe, expect, it } from 'vitest'
import { evalExpr } from '../src/expr'

describe('evalExpr（严格左结合，无优先级）', () => {
  it('基本四则运算', () => {
    expect(evalExpr('3 + 6')).toBe(9)
    expect(evalExpr('17 - 8')).toBe(9)
    expect(evalExpr('6 × 7')).toBe(42)
    expect(evalExpr('56 ÷ 8')).toBe(7)
  })
  it('三操作数从左到右', () => {
    expect(evalExpr('3 + 6 - 2')).toBe(7)
    expect(evalExpr('10 - 3 - 7')).toBe(0)
    // 关键：左结合而非乘除优先 —— 12 ÷ 3 × 2 应为 8 而不是 2
    expect(evalExpr('12 ÷ 3 × 2')).toBe(8)
    expect(evalExpr('2 × 3 × 4')).toBe(24)
  })
  it('非整除 / 除零 / 非法输入返回 null', () => {
    expect(evalExpr('7 ÷ 2')).toBeNull()
    expect(evalExpr('7 ÷ 0')).toBeNull()
    expect(evalExpr('')).toBeNull()
    expect(evalExpr('3 +')).toBeNull()
    expect(evalExpr('3 6')).toBeNull()
    expect(evalExpr('a + 6')).toBeNull()
    expect(evalExpr('3 ^ 2')).toBeNull()
    expect(evalExpr('3.5 + 1')).toBeNull()
  })
})
