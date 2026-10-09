import { beforeEach, describe, expect, it, vi } from 'vitest'

/** localStorage 内存桩（node 环境无 localStorage） */
class LocalStorageStub {
  private m = new Map<string, string>()
  getItem(k: string): string | null {
    return this.m.has(k) ? this.m.get(k)! : null
  }
  setItem(k: string, v: string): void {
    this.m.set(k, String(v))
  }
  removeItem(k: string): void {
    this.m.delete(k)
  }
  clear(): void {
    this.m.clear()
  }
}

vi.stubGlobal('localStorage', new LocalStorageStub())
const fetchMock = vi.fn()
vi.stubGlobal('fetch', fetchMock)

// auth store 在模块加载时读取 localStorage，必须在 stub 之后动态导入
const { useAuthStore } = await import('@/stores/auth')
const { ApiError, setUnauthorizedHandler } = await import('@/api/http')

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response
}

beforeEach(() => {
  localStorage.clear()
  fetchMock.mockReset()
  const auth = useAuthStore()
  auth.logout()
})

describe('auth store', () => {
  it('login 成功：写入 state 与 localStorage', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, { token: 't1', user: { id: 1, username: 'ABC01', email: 'a@b.com' } })
    )
    const auth = useAuthStore()
    await auth.login('ABC01', 'abc12345')
    expect(auth.state.token).toBe('t1')
    expect(auth.state.user?.username).toBe('ABC01')
    expect(localStorage.getItem('math_token')).toBe('t1')
    expect(JSON.parse(localStorage.getItem('math_user')!).username).toBe('ABC01')
    // 请求体确认
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(JSON.parse(String(init.body))).toEqual({ username: 'ABC01', password: 'abc12345' })
  })

  it('register 成功：注册即登录', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(201, { token: 't2', user: { id: 2, username: 'NEW1', email: 'n@b.com' } })
    )
    const auth = useAuthStore()
    await auth.register('NEW1', 'abc12345', 'n@b.com')
    expect(auth.state.token).toBe('t2')
    expect(localStorage.getItem('math_token')).toBe('t2')
  })

  it('login 失败（401 INVALID_CREDENTIALS）：抛出 ApiError，不写登录态', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(401, { error: { code: 'INVALID_CREDENTIALS', message: '用户名或密码不正确' } })
    )
    const auth = useAuthStore()
    await expect(auth.login('ABC01', 'wrong')).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    })
    expect(auth.state.token).toBeNull()
    expect(localStorage.getItem('math_token')).toBeNull()
  })

  it('logout 清空 state 与 localStorage', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, { token: 't3', user: { id: 3, username: 'X1', email: 'x@b.com' } })
    )
    const auth = useAuthStore()
    await auth.login('X1', 'abc12345')
    auth.logout()
    expect(auth.state.token).toBeNull()
    expect(auth.state.user).toBeNull()
    expect(localStorage.getItem('math_token')).toBeNull()
  })

  it('网络错误：fetch reject → ApiError NETWORK_ERROR', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'))
    const auth = useAuthStore()
    await expect(auth.login('ABC01', 'abc12345')).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
    })
  })

  it('auth:true 请求收到 401：清登录态并触发跳转回调', async () => {
    // 先登录
    fetchMock.mockResolvedValue(
      jsonResponse(200, { token: 't4', user: { id: 4, username: 'Y1', email: 'y@b.com' } })
    )
    const auth = useAuthStore()
    await auth.login('Y1', 'abc12345')

    // 再模拟 401
    fetchMock.mockResolvedValue(
      jsonResponse(401, { error: { code: 'UNAUTHORIZED', message: '登录已过期，请重新登录' } })
    )
    const onUnauthorized = vi.fn()
    setUnauthorizedHandler(onUnauthorized)

    const { fetchProfileApi } = await import('@/api')
    await expect(fetchProfileApi()).rejects.toBeInstanceOf(ApiError)
    expect(onUnauthorized).toHaveBeenCalledOnce()
    expect(auth.state.token).toBeNull()
    expect(localStorage.getItem('math_token')).toBeNull()

    setUnauthorizedHandler(() => {}) // 清理，避免影响其他用例
  })

  it('auth:true 请求自动携带 Bearer token', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, { token: 't5', user: { id: 5, username: 'Z1', email: 'z@b.com' } })
    )
    const auth = useAuthStore()
    await auth.login('Z1', 'abc12345')

    fetchMock.mockResolvedValue(jsonResponse(200, { user: {}, stats: {} }))
    const { fetchProfileApi } = await import('@/api')
    await fetchProfileApi()
    const [, init] = fetchMock.mock.calls[1] as [string, RequestInit]
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer t5')
  })
})
