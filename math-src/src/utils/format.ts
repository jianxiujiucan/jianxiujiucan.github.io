/** 毫秒 → "1.23 秒"（单题用时展示） */
export function formatMs(ms: number): string {
  return `${(ms / 1000).toFixed(2)} 秒`
}

/** 每题平均用时展示："1.85 秒/题"，null 显示 - */
export function formatMsPerQ(ms: number | null): string {
  return ms === null ? '-' : `${(ms / 1000).toFixed(2)} 秒/题`
}

/** 毫秒 → "1分23秒" / "45秒"（整场用时） */
export function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000)
  const m = Math.floor(s / 60)
  const r = s % 60
  return m > 0 ? `${m}分${String(r).padStart(2, '0')}秒` : `${r}秒`
}

/**
 * 解析后端时间串为 Date。后端返回 pg timestamptz 原串，
 * 形如 "2026-10-10 01:40:39.203987+00"（空格分隔 + 时区偏移），
 * 规范化为 ISO 后按浏览器本地时区展示。
 */
function parseServerTime(s: string): Date {
  const iso = (s.includes('T') ? s : s.replace(' ', 'T')).replace(/([+-]\d{2})$/, '$1:00')
  return new Date(iso)
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

/** 时间串 → 本地 "10-08 15:30" */
export function formatDateTime(s: string): string {
  const d = parseServerTime(s)
  if (Number.isNaN(d.getTime())) return s
  return `${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

/** 时间串 → 本地 "2026-10-08" */
export function formatDate(s: string): string {
  const d = parseServerTime(s)
  if (Number.isNaN(d.getTime())) return s
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

const OP_TYPE_LABELS: Record<string, string> = {
  add: '仅加法',
  sub: '仅减法',
  addsub: '加减混合',
  mul: '仅乘法',
  div: '仅除法',
  muldiv: '乘除混合',
}

/** 运算类型 → 中文名 */
export function opTypeLabel(t: string): string {
  return OP_TYPE_LABELS[t] ?? t
}
