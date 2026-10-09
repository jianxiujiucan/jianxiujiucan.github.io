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

/* ---------- pg 查询行类型 ----------
 * 用 type 别名（隐式索引签名）以满足 pg 的 QueryResultRow 约束。
 * 注意 pg 类型映射：int8（COUNT/SUM/BIGINT）返回 string；numeric（ROUND/AVG）返回 string；
 * boolean 返回真正的 boolean；int2/int4 返回 number。 */

export type IdRow = { id: number }

export type UserAuthRow = {
  id: number
  username: string
  email: string
  password_hash: string
}

export type UserPublicRow = {
  id: number
  username: string
  email: string
  created_at: string
}

export type ResetRow = {
  id: number
  code_hash: string
  attempts: number
  unexpired: boolean
}

export type ElapsedRow = { elapsed: string }

export type TotalsRow = {
  totalSessions: string
  totalQuestions: string | null
  totalCorrect: string | null
}

export type PerTypeRow = {
  opType: string
  sessions: string
  bestAvgMs: string | null
  bestScore: number | null
}

export type SessionRow = {
  id: number
  opType: string
  count: number
  range: number
  operands: number
  carry: boolean
  total: number
  correct: number
  score: number
  durationMs: number
  createdAt: string
}

export type CountRow = { total: string }

export type QuestionRow = {
  seq: number
  expr: string
  userAnswer: string
  correctAnswer: number
  isCorrect: boolean
  timeMs: number
}

export type LeaderboardRow = {
  username: string
  avgMs: string
  total: number
  createdAt: string
}
