/** 与前端 types/quiz.ts 的 OpType 保持一致 */
export const OP_TYPES = ['add', 'sub', 'addsub', 'mul', 'div', 'muldiv'] as const
export type OpType = (typeof OP_TYPES)[number]

export interface QuizConfigDto {
  count: number
  opType: OpType
  range: number
  operands: number
  carry: boolean
}

export interface QuestionRecordDto {
  seq: number
  expr: string
  userAnswer: string
  correctAnswer: number
  isCorrect: boolean
  timeMs: number
}

export interface UserRow {
  id: number
  username: string
  email: string
  created_at: string
}
