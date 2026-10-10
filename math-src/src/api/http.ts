import { clearAuth, getToken } from "./token";

const BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * 401 时由 main.ts 注入的跳转逻辑。
 * http.ts 不 import router（保持纯 node 环境可测）。
 */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void): void {
  onUnauthorized = fn;
}

interface Options {
  method?: "GET" | "POST";
  body?: unknown;
  /** 需要携带 Bearer token 的请求 */
  auth?: boolean;
}

export async function api<T>(path: string, opts: Options = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: opts.method ?? "GET",
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "无法连接到服务器");
  }

  const data = (await res.json().catch(() => null)) as {
    error?: { code?: string; message?: string };
  } | null;

  if (res.status === 401 && opts.auth) {
    clearAuth(); // 触发订阅 → auth store 同步清空
    onUnauthorized?.();
    throw new ApiError(
      401,
      data?.error?.code ?? "UNAUTHORIZED",
      data?.error?.message ?? "登录已过期，请重新登录"
    );
  }
  if (!res.ok) {
    throw new ApiError(
      res.status,
      data?.error?.code ?? "UNKNOWN",
      data?.error?.message ?? `请求失败 (${res.status})`
    );
  }
  return data as T;
}
