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

/** "2026-10-08 15:30:00.000" → "10-08 15:30" */
export function formatDateTime(s: string): string {
  const m = s.match(/^\d{4}-(\d{2}-\d{2})[ T](\d{2}:\d{2})/)
  return m ? `${m[1]} ${m[2]}` : s
}

/** "2026-10-08 15:30:00.000" → "2026-10-08" */
export function formatDate(s: string): string {
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : s
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
