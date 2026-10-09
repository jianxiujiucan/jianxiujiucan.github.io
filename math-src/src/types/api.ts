import type { OpType, QuizConfig } from './quiz'

export interface StoredUser {
  id: number
  username: string
  email: string
}

export interface AuthResponse {
  token: string
  user: StoredUser
}

/** 每题作答记录（上传与详情展示共用） */
export interface QuestionRecordDto {
  seq: number
  expr: string
  userAnswer: string
  correctAnswer: number
  isCorrect: boolean
  timeMs: number
}

export interface SaveSessionPayload {
  config: QuizConfig
  durationMs: number
  questions: QuestionRecordDto[]
}

export interface SaveSessionResponse {
  sessionId: number
}

/** 一场答题的摘要（列表/详情共用） */
export interface SessionSummary {
  id: number
  opType: OpType
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

export interface PerTypeStat {
  opType: OpType
  sessions: number
  bestAvgMs: number | null
  bestScore: number | null
}

export interface ProfileResponse {
  user: { username: string; email: string; createdAt: string }
  stats: {
    totalSessions: number
    totalQuestions: number
    totalCorrect: number
    accuracy: number
    perType: PerTypeStat[]
  }
}

export interface SessionListResponse {
  list: SessionSummary[]
  total: number
  page: number
  pageSize: number
}

export interface SessionDetailResponse {
  session: SessionSummary
  questions: QuestionRecordDto[]
}

export interface LeaderboardItem {
  rank: number
  username: string
  avgMs: number
  total: number
  createdAt: string
}

export interface LeaderboardResponse {
  opType: OpType
  list: LeaderboardItem[]
}
