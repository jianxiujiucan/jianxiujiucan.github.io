import { describe, expect, it } from 'vitest'
import { exprText, generateQuestions } from '@/utils/generator'
import type { Question, QuizConfig } from '@/types/quiz'

/** 用真实运算验证 answer 字段（÷ 非整除时抛错） */
function evalQ(q: Question): number {
  let v = q.nums[0]
  q.ops.forEach((op, i) => {
    const n = q.nums[i + 1]
    if (op === '+') v += n
    else if (op === '-') v -= n
    else if (op === '×') v *= n
    else if (op === '÷') {
      if (v % n !== 0) throw new Error(`非整除: ${exprText(q)}`)
      v /= n
    }
  })
  return v
}

const types = ['add', 'sub', 'addsub', 'mul', 'div', 'muldiv'] as const
const ranges = [10, 20, 100] as const
const operandOptions = [2, 3] as const
const addSubTypes: readonly string[] = ['add', 'sub', 'addsub']
const mulDivTypes: readonly string[] = ['mul', 'div', 'muldiv']

describe('generateQuestions 全组合矩阵', () => {
  for (const opType of types) {
    for (const range of ranges) {
      for (const operands of operandOptions) {
        for (const carry of [false, true]) {
          // 乘除法 carry 无意义，跳过组合
          if (carry && mulDivTypes.includes(opType)) continue
          const title = `${opType} / ${range}以内 / ${operands}个数 / carry=${carry}`
          it(title, () => {
            const cfg: QuizConfig = { count: 100, opType, range, operands, carry }
            const qs = generateQuestions(cfg)
            expect(qs.length).toBe(100)

            // 空间足够时（加减法 20/100 以内、未勾选进位）不允许重复
            if (addSubTypes.includes(opType) && range >= 20 && !carry) {
              expect(new Set(qs.map((q) => q.key)).size).toBe(100)
            }

            for (const q of qs) {
              const real = evalQ(q)
              const text = exprText(q)
              expect(real, text).toBe(q.answer) // 答案正确性
              expect(Number.isInteger(real) && real >= 0, text).toBe(true) // 非负整数
              expect(real, text).toBeLessThanOrEqual(range) // 结果不超范围

              const isAddSub = q.ops.every((o) => o === '+' || o === '-')
              if (isAddSub) {
                // 加减法中加数不允许出现 0
                for (const n of q.nums) expect(n, text).toBeGreaterThanOrEqual(1)
                if (carry) {
                  // “仅加法+三个数+10以内+进位”物理无解（4+4+4=12>10），程序会放宽加数下限兜底
                  const relaxed = opType === 'add' && operands === 3 && range < 12
                  if (!relaxed) {
                    for (const n of q.nums) expect(n, text).toBeGreaterThanOrEqual(4)
                  }
                }
              }
              // 两数减法结果不允许为 0
              if (q.ops.length === 1 && q.ops[0] === '-') {
                expect(q.answer, text).not.toBe(0)
              }
              // 乘除法：乘数/除数（运算符右侧的数）取 2~9；被除数不超过 range
              if (!isAddSub) {
                q.ops.forEach((_, i) => {
                  const right = q.nums[i + 1]
                  expect(right, text).toBeGreaterThanOrEqual(2)
                  expect(right, text).toBeLessThanOrEqual(9)
                })
                expect(q.nums[0], text).toBeGreaterThanOrEqual(2)
                expect(q.nums[0], text).toBeLessThanOrEqual(range)
              }
            }
          })
        }
      }
    }
  }
})

describe('进位/退位概率', () => {
  it('加法勾选进位后占比 >= 55%', () => {
    const qs = generateQuestions({ count: 100, opType: 'add', range: 100, operands: 2, carry: true })
    const n = qs.filter((q) => (q.nums[0] % 10) + (q.nums[1] % 10) >= 10).length
    expect(n).toBeGreaterThanOrEqual(55)
  })

  it('减法勾选退位后占比 >= 55%', () => {
    const qs = generateQuestions({ count: 100, opType: 'sub', range: 100, operands: 2, carry: true })
    const n = qs.filter((q) => q.nums[0] % 10 < q.nums[1] % 10).length
    expect(n).toBeGreaterThanOrEqual(55)
  })

  it('未勾选时进位占比（仅记录，不断言）', () => {
    const qs = generateQuestions({ count: 100, opType: 'add', range: 100, operands: 2, carry: false })
    const n = qs.filter((q) => (q.nums[0] % 10) + (q.nums[1] % 10) >= 10).length
    console.log(`未勾选时进位题占比: ${n}%`)
  })
})
