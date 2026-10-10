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

/** 管理员重置用户密码（/admin 管理页用；口令经 X-Admin-Token 头传递） */
export function adminResetPasswordApi(username: string, newPassword: string, adminToken: string) {
  return api<{ message: string }>('/api/admin/reset-password', {
    method: 'POST',
    body: { username, newPassword },
    headers: { 'X-Admin-Token': adminToken },
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
