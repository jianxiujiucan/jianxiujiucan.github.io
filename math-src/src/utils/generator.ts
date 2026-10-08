/* =========================================================
 * 题目生成 —— 小学一、二年级 加/减/乘/除 口算
 * （自原 script.js 移植，算法行为保持不变，仅补充类型）
 *
 * 题目对象统一结构见 types/quiz.ts 的 Question；
 * key 用于同组内去重：纯加法/纯乘法对操作数排序（3+6 与 6+3 视为同题），
 * 其余按算式顺序区分。
 * ========================================================= */

import type { OpSymbol, Question, QuizConfig } from '@/types/quiz'

/** 内部中间类型：key 由外层统一挂上 */
type QuestionDraft = Omit<Question, 'key'>

/* ---------------- 工具函数 ---------------- */

function randInt(min: number, max: number): number {
  if (max < min) return min
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** 去重 key：操作数排序（用于纯加法、纯乘法等满足交换律的题） */
function sortedKey(prefix: string, nums: number[]): string {
  return prefix + [...nums].sort((a, b) => a - b).join(',')
}

/** 去重 key：按算式顺序（减、除、混合运算交换后是不同题） */
function seqKey(nums: number[], ops: OpSymbol[]): string {
  let k = String(nums[0])
  ops.forEach((op, i) => {
    k += op + nums[i + 1]
  })
  return k
}

/* ---------- 加减法（随机生成，支持进位/退位倾向） ---------- */

/** 两数加法：a+b <= range；requireCarry 时要求个位相加 >= 10 */
function tryAdd2(range: number, minNum: number, requireCarry: boolean): QuestionDraft | null {
  for (let i = 0; i < 300; i++) {
    const a = randInt(minNum, range - 1)
    const maxB = range - a
    if (maxB < minNum) continue
    const b = randInt(minNum, maxB)
    if (requireCarry && (a % 10) + (b % 10) < 10) continue
    return { nums: [a, b], ops: ['+'], answer: a + b }
  }
  return null
}

/** 两数减法：a-b >= 1（结果不允许为 0），a <= range；requireBorrow 时要求个位不够减 */
function trySub2(range: number, minNum: number, requireBorrow: boolean): QuestionDraft | null {
  for (let i = 0; i < 300; i++) {
    const a = randInt(minNum + 1, range)
    const maxB = a - 1 // 结果 >= 1，且 b < a
    if (maxB < minNum) continue
    const b = randInt(minNum, maxB)
    if (requireBorrow && a % 10 >= b % 10) continue
    return { nums: [a, b], ops: ['-'], answer: a - b }
  }
  return null
}

/** 三数加法：a+b+c <= range（逐步受限采样，range >= 3*minNum 时每次必中） */
function tryAdd3(range: number, minNum: number, requireCarry: boolean): QuestionDraft | null {
  for (let i = 0; i < 300; i++) {
    const a = randInt(minNum, range - 2 * minNum)
    const b = randInt(minNum, range - a - minNum)
    const c = randInt(minNum, range - a - b)
    const sum = a + b + c
    if (sum > range) continue
    if (requireCarry && (a % 10) + (b % 10) + (c % 10) < 10) continue
    return { nums: [a, b, c], ops: ['+', '+'], answer: sum }
  }
  return null
}

/** 三数减法：a-b-c >= 0（三个数相减结果允许为 0），a <= range */
function trySub3(range: number, minNum: number, requireBorrow: boolean): QuestionDraft | null {
  for (let i = 0; i < 300; i++) {
    const a = randInt(2 * minNum, range) // 保证 b、c 都有取值空间
    if (a < 2 * minNum) continue // range 太小（无解）时跳过
    const b = randInt(minNum, a - minNum)
    const r1 = a - b // r1 >= minNum
    const c = randInt(minNum, r1)
    const answer = r1 - c // >= 0，允许等于 0
    if (requireBorrow) {
      const firstBorrow = a % 10 < b % 10
      const secondBorrow = r1 % 10 < c % 10
      if (!firstBorrow && !secondBorrow) continue
    }
    return { nums: [a, b, c], ops: ['-', '-'], answer }
  }
  return null
}

/** 三数加减混合：a+b-c 或 a-b+c，中间结果与最终结果均不为负、不超过 range */
function tryMix3(range: number, minNum: number, requireCarryBorrow: boolean): QuestionDraft | null {
  for (let i = 0; i < 300; i++) {
    if (Math.random() < 0.5) {
      // a + b - c
      const a = randInt(minNum, range - minNum)
      const b = randInt(minNum, range - a) // 和 s <= range，且 s >= minNum
      const s = a + b
      if (s > range || s < minNum) continue
      const c = randInt(minNum, s) // 结果 >= 0，允许为 0
      const answer = s - c
      if (requireCarryBorrow) {
        const carry = (a % 10) + (b % 10) >= 10
        const borrow = s % 10 < c % 10
        if (!carry && !borrow) continue
      }
      return { nums: [a, b, c], ops: ['+', '-'], answer }
    } else {
      // a - b + c（减法部分结果 >= 1，避免 a-a+c 的形式）
      const a = randInt(minNum + 1, range)
      if (a < minNum + 1) continue
      const b = randInt(minNum, a - 1)
      const r = a - b
      if (range - r < minNum) continue // 保证 c 有取值空间
      const c = randInt(minNum, range - r)
      const answer = r + c
      if (answer > range) continue
      if (requireCarryBorrow) {
        const borrow = a % 10 < b % 10
        const carry = (r % 10) + (c % 10) >= 10
        if (!borrow && !carry) continue
      }
      return { nums: [a, b, c], ops: ['-', '+'], answer }
    }
  }
  return null
}

/** 随机类（加法 / 减法 / 加减混合）按指定约束生成一题 */
function tryRandom(cfg: QuizConfig, minNum: number, want: boolean): Question | null {
  const { opType, range, operands } = cfg
  let q: QuestionDraft | null = null
  if (opType === 'add') {
    q = operands === 2 ? tryAdd2(range, minNum, want) : tryAdd3(range, minNum, want)
  } else if (opType === 'sub') {
    q = operands === 2 ? trySub2(range, minNum, want) : trySub3(range, minNum, want)
  } else {
    // addsub 加减混合
    if (operands === 2) {
      // 某个分支无解时自动落到另一分支（保持加数下限约束）
      q =
        Math.random() < 0.5
          ? tryAdd2(range, minNum, want) || trySub2(range, minNum, want)
          : trySub2(range, minNum, want) || tryAdd2(range, minNum, want)
    } else {
      // 随机排序三种形式依次尝试：纯加法无解（如10以内+进位）时落到减法/混合
      const fns = shuffle([tryAdd3, trySub3, tryMix3])
      for (const fn of fns) {
        q = fn(range, minNum, want)
        if (q) break
      }
    }
  }
  if (!q) return null
  const key = q.ops.every((o) => o === '+') ? sortedKey('A', q.nums) : seqKey(q.nums, q.ops)
  return { ...q, key }
}

function genRandomOne(cfg: QuizConfig): Question | null {
  // 勾选进位/退位后：所有加数不小于 4，且 75% 的题强制要求进位/退位
  const minNum = cfg.carry ? 4 : 1 // 加减法中加数不允许出现 0
  const want = cfg.carry ? Math.random() < 0.75 : false

  let q = tryRandom(cfg, minNum, want)
  if (!q && cfg.carry) {
    // 约束无解时兜底放宽（如“10以内+三个数+进位”：加数>=4 时最小和为 12）
    q = tryRandom(cfg, 1, Math.random() < 0.75) || tryRandom(cfg, 1, false)
  }
  return q
}

/* ---------- 乘除法（枚举全部合法候选，洗牌抽取） ---------- */

/** 乘法候选：乘数取 2~9（表内乘法），积 <= range；操作数排序去重 */
function mulCandidates(range: number, operands: number): Question[] {
  const list: Question[] = []
  if (operands === 2) {
    for (let a = 2; a <= 9; a++) {
      for (let b = a; b <= 9; b++) {
        if (a * b <= range) {
          list.push({
            nums: [a, b],
            ops: ['×'],
            answer: a * b,
            key: sortedKey('M', [a, b]),
          })
        }
      }
    }
  } else {
    for (let a = 2; a <= 9; a++) {
      for (let b = a; b <= 9; b++) {
        for (let c = b; c <= 9; c++) {
          const p = a * b * c
          if (p <= range) {
            list.push({
              nums: [a, b, c],
              ops: ['×', '×'],
              answer: p,
              key: sortedKey('M', [a, b, c]),
            })
          }
        }
      }
    }
  }
  return list
}

/** 除法候选：整除；除数、商取 2~9，被除数 <= range */
function divCandidates(range: number, operands: number): Question[] {
  const list: Question[] = []
  if (operands === 2) {
    for (let b = 2; b <= 9; b++) {
      for (let c = 2; c <= 9; c++) {
        const a = b * c
        if (a <= range) {
          list.push({
            nums: [a, b],
            ops: ['÷'],
            answer: c,
            key: seqKey([a, b], ['÷']),
          })
        }
      }
    }
  } else {
    // 连除 a÷b÷c = k，a = b*c*k <= range
    for (let b = 2; b <= 9; b++) {
      for (let c = 2; c <= 9; c++) {
        for (let k = 2; k <= 9; k++) {
          const a = b * c * k
          if (a <= range) {
            list.push({
              nums: [a, b, c],
              ops: ['÷', '÷'],
              answer: k,
              key: seqKey([a, b, c], ['÷', '÷']),
            })
          }
        }
      }
    }
  }
  return list
}

/** 乘除混合候选：两数为乘法+除法；三个数增加 ×÷ 与 ÷× 两种混合形式（保证整除） */
function mulDivCandidates(range: number, operands: number): Question[] {
  if (operands === 2) {
    return [...mulCandidates(range, 2), ...divCandidates(range, 2)]
  }
  const list = [...mulCandidates(range, 3), ...divCandidates(range, 3)]
  // a × b ÷ c：积 <= range，c 能整除积
  for (let a = 2; a <= 9; a++) {
    for (let b = 2; b <= 9; b++) {
      const p = a * b
      if (p > range) continue
      for (let c = 2; c <= 9; c++) {
        if (p % c !== 0) continue
        list.push({
          nums: [a, b, c],
          ops: ['×', '÷'],
          answer: p / c,
          key: seqKey([a, b, c], ['×', '÷']),
        })
      }
    }
  }
  // a ÷ b × c：a = b*k（整除，k >= 2），a <= range，结果 k*c <= range
  for (let b = 2; b <= 9; b++) {
    for (let k = 2; k <= 9; k++) {
      const a = b * k
      if (a > range) continue
      for (let c = 2; c <= 9; c++) {
        const r = k * c
        if (r > range) continue
        list.push({
          nums: [a, b, c],
          ops: ['÷', '×'],
          answer: r,
          key: seqKey([a, b, c], ['÷', '×']),
        })
      }
    }
  }
  return list
}

/* ---------- 生成一组题 ---------- */

export function generateQuestions(cfg: QuizConfig): Question[] {
  const { count, opType } = cfg

  if (opType === 'add' || opType === 'sub' || opType === 'addsub') {
    const qs: Question[] = []
    const used = new Set<string>()
    let attempts = 0
    // 先保证不重复
    while (qs.length < count && attempts < count * 400) {
      attempts++
      const q = genRandomOne(cfg)
      if (!q || used.has(q.key)) continue
      used.add(q.key)
      qs.push(q)
    }
    // 兜底：组合空间不足时（如 10 以内且要求进位）允许重复，保证题数
    let guard = 0
    while (qs.length < count && guard < count * 100) {
      guard++
      const q = genRandomOne(cfg)
      if (q) qs.push(q)
    }
    return qs
  }

  // 枚举类（乘/除/乘除混合）：洗牌后依次取，候选不足时循环洗牌补足
  const pool =
    opType === 'mul'
      ? mulCandidates(cfg.range, cfg.operands)
      : opType === 'div'
        ? divCandidates(cfg.range, cfg.operands)
        : mulDivCandidates(cfg.range, cfg.operands)

  const qs: Question[] = []
  let deck = shuffle([...pool])
  while (qs.length < count && pool.length > 0) {
    if (deck.length === 0) deck = shuffle([...pool])
    qs.push(deck.pop()!)
  }
  return qs
}

/** 算式文本："3 + 6"（题目渲染与错题反馈共用） */
export function exprText(q: Question): string {
  let s = String(q.nums[0])
  q.ops.forEach((op, i) => {
    s += ` ${op} ${q.nums[i + 1]}`
  })
  return s
}
