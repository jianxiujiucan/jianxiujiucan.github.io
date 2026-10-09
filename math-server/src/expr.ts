/* =========================================================
 * 算式求值 —— 服务端复核答案用（防篡改刷榜）
 * 与前端出题器同一语义：全部运算严格从左到右，无优先级
 * （见 math-src/tests/generator.test.ts 的 evalQ）
 * 非法算式 / 非整数 / 非整除 → 返回 null
 * ========================================================= */

export function evalExpr(expr: string): number | null {
  const tokens = expr.trim().split(/\s+/)
  if (tokens.length < 3 || tokens.length % 2 === 0) return null
  let acc = Number(tokens[0])
  if (!Number.isInteger(acc)) return null
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i]
    const n = Number(tokens[i + 1])
    if (!Number.isInteger(n)) return null
    if (op === '+') acc += n
    else if (op === '-') acc -= n
    else if (op === '×') acc *= n
    else if (op === '÷') {
      if (n === 0 || acc % n !== 0) return null
      acc /= n
    } else return null
  }
  return acc
}
