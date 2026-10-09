import { reactive } from 'vue'
import type { StoredUser } from '@/types/api'
import { loginApi, registerApi } from '@/api'
import {
  clearAuth,
  getStoredUser,
  getToken,
  onAuthCleared,
  saveAuth,
} from '@/api/token'

const state = reactive<{ token: string | null; user: StoredUser | null }>({
  token: getToken(),
  user: getStoredUser(),
})

// http 层 401 清登录态时同步到这里
onAuthCleared(() => {
  state.token = null
  state.user = null
})

export function useAuthStore() {
  async function login(username: string, password: string): Promise<void> {
    const r = await loginApi(username, password)
    saveAuth(r.token, r.user)
    state.token = r.token
    state.user = r.user
  }

  async function register(username: string, password: string, email: string): Promise<void> {
    const r = await registerApi(username, password, email)
    saveAuth(r.token, r.user)
    state.token = r.token
    state.user = r.user
  }

  function logout(): void {
    clearAuth() // 经订阅同步 state
  }

  return { state, login, register, logout }
}
