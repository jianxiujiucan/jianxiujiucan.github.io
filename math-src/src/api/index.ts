import { api } from './http'
import type {
  AuthResponse,
  LeaderboardResponse,
  ProfileResponse,
  SaveSessionPayload,
  SaveSessionResponse,
  SessionDetailResponse,
  SessionListResponse,
} from '@/types/api'
import type { OpType } from '@/types/quiz'

export function loginApi(username: string, password: string) {
  return api<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: { username, password },
  })
}

export function registerApi(username: string, password: string, email: string) {
  return api<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: { username, password, email },
  })
}

export function forgotApi(email: string) {
  return api<{ message: string }>('/api/auth/forgot', {
    method: 'POST',
    body: { email },
  })
}

export function resetApi(email: string, code: string, newPassword: string) {
  return api<{ message: string }>('/api/auth/reset', {
    method: 'POST',
    body: { email, code, newPassword },
  })
}

export function saveSessionApi(payload: SaveSessionPayload) {
  return api<SaveSessionResponse>('/api/quiz-sessions', {
    method: 'POST',
    body: payload,
    auth: true,
  })
}

export function fetchProfileApi() {
  return api<ProfileResponse>('/api/profile', { auth: true })
}

export function fetchSessionsApi(page: number, pageSize = 10) {
  return api<SessionListResponse>(`/api/profile/sessions?page=${page}&pageSize=${pageSize}`, {
    auth: true,
  })
}

export function fetchSessionDetailApi(id: number) {
  return api<SessionDetailResponse>(`/api/profile/sessions/${id}`, { auth: true })
}

export function fetchLeaderboardApi(opType: OpType) {
  return api<LeaderboardResponse>(`/api/leaderboard?op_type=${opType}`)
}
