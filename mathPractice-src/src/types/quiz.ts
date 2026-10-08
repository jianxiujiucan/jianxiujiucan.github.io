export type OpType = 'add' | 'sub' | 'addsub' | 'mul' | 'div' | 'muldiv'
export type OpSymbol = '+' | '-' | '×' | '÷'
export type RangeLimit = 10 | 20 | 100
export type OperandCount = 2 | 3
export type CountOption = 10 | 20 | 30 | 50 | 100

export interface QuizConfig {
  count: CountOption
  opType: OpType
  range: RangeLimit
  operands: OperandCount
  /** 进位/退位倾向（仅加减类生效） */
  carry: boolean
}

export interface Question {
  nums: number[]
  ops: OpSymbol[]
  answer: number
  /**
   * 组内去重 key：纯加法/纯乘法对操作数排序（3+6 与 6+3 视为同题），
   * 其余按算式顺序区分。
   */
  key: string
}
