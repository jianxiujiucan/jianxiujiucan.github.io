import type { StoredUser } from '@/types/api'

const TOKEN_KEY = 'math_token'
const USER_KEY = 'math_user'

/** clearAuth 时的订阅者（auth store 借此同步清空内存状态，避免 http 层与 store 循环 import） */
const clearedListeners = new Set<() => void>()

export function onAuthCleared(fn: () => void): void {
  clearedListeners.add(fn)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): StoredUser | null {
  try {
    const s = localStorage.getItem(USER_KEY)
    return s ? (JSON.parse(s) as StoredUser) : null
  } catch {
    return null
  }
}

export function saveAuth(token: string, user: StoredUser): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  clearedListeners.forEach((fn) => fn())
}
