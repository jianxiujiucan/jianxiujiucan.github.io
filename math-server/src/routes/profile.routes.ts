import { Router } from 'express'
import type { RowDataPacket } from 'mysql2'
import { pool } from '../db'
import { requireAuth } from '../auth'
import { httpError } from '../httpError'

export const profileRoutes = Router()

// 该路由组全部需要登录
profileRoutes.use(requireAuth)

/* ---------- 用户信息 + 统计 ---------- */
profileRoutes.get('/', async (req, res) => {
  const uid = req.user!.uid

  const [users] = await pool.query<RowDataPacket[]>(
    'SELECT username, email, created_at AS createdAt FROM users WHERE id = ?',
    [uid]
  )
  const user = users[0]
  if (!user) throw httpError(401, 'UNAUTHORIZED', '账号不存在，请重新登录')

  const [totals] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS totalSessions,
            COALESCE(SUM(total), 0) AS totalQuestions,
            COALESCE(SUM(correct), 0) AS totalCorrect
     FROM quiz_sessions WHERE user_id = ?`,
    [uid]
  )
  const t = totals[0]
  const totalQuestions = Number(t.totalQuestions)
  const totalCorrect = Number(t.totalCorrect)

  // 分类型统计：场次/最高分统计全部记录；bestAvgMs 与排行榜同口径（仅正确率≥90%场次）
  const [perTypeRows] = await pool.query<RowDataPacket[]>(
    `SELECT s.op_type AS opType,
            COUNT(DISTINCT s.id) AS sessions,
            ROUND(MIN(IF(s.correct * 10 >= s.total * 9, a.avg_ms, NULL))) AS bestAvgMs,
            MAX(s.score) AS bestScore
     FROM quiz_sessions s
     JOIN (
       SELECT session_id, AVG(time_ms) AS avg_ms
       FROM question_records GROUP BY session_id
     ) a ON a.session_id = s.id
     WHERE s.user_id = ?
     GROUP BY s.op_type`,
    [uid]
  )

  res.json({
    user: { username: String(user.username), email: String(user.email), createdAt: user.createdAt },
    stats: {
      totalSessions: Number(t.totalSessions),
      totalQuestions,
      totalCorrect,
      accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      perType: perTypeRows.map((r) => ({
        opType: String(r.opType),
        sessions: Number(r.sessions),
        bestAvgMs: r.bestAvgMs === null ? null : Number(r.bestAvgMs),
        bestScore: r.bestScore === null ? null : Number(r.bestScore),
      })),
    },
  })
})

/* ---------- 答题记录列表（分页） ---------- */
profileRoutes.get('/sessions', async (req, res) => {
  const uid = req.user!.uid
  const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10) || 1)
  const pageSize = Math.min(50, Math.max(1, Number.parseInt(String(req.query.pageSize ?? '10'), 10) || 10))
  const offset = (page - 1) * pageSize

  // page/pageSize 已 parseInt + clamp，纯整数拼接无注入面（同时规避 mysql2 LIMIT 占位符怪癖）
  const [list] = await pool.query<RowDataPacket[]>(
    `SELECT id, op_type AS opType, count_opt AS count, range_limit AS \`range\`,
            operands, carry, total, correct, score,
            duration_ms AS durationMs, created_at AS createdAt
     FROM quiz_sessions
     WHERE user_id = ?
     ORDER BY created_at DESC, id DESC
     LIMIT ${pageSize} OFFSET ${offset}`,
    [uid]
  )
  const [cnt] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM quiz_sessions WHERE user_id = ?',
    [uid]
  )
  res.json({ list, total: Number(cnt[0].total), page, pageSize })
})

/* ---------- 单场详情（每题明细；非本人返回 404 不泄露存在性） ---------- */
profileRoutes.get('/sessions/:id', async (req, res) => {
  const uid = req.user!.uid
  const id = Number.parseInt(req.params.id, 10)
  if (!Number.isInteger(id) || id <= 0) throw httpError(404, 'NOT_FOUND', '记录不存在')

  const [sessions] = await pool.query<RowDataPacket[]>(
    `SELECT id, op_type AS opType, count_opt AS count, range_limit AS \`range\`,
            operands, carry, total, correct, score,
            duration_ms AS durationMs, created_at AS createdAt
     FROM quiz_sessions WHERE id = ? AND user_id = ?`,
    [id, uid]
  )
  if (sessions.length === 0) throw httpError(404, 'NOT_FOUND', '记录不存在')

  const [questions] = await pool.query<RowDataPacket[]>(
    `SELECT seq, expr, user_answer AS userAnswer, correct_answer AS correctAnswer,
            is_correct AS isCorrect, time_ms AS timeMs
     FROM question_records WHERE session_id = ? ORDER BY seq ASC`,
    [id]
  )
  res.json({
    session: sessions[0],
    questions: questions.map((q) => ({
      seq: Number(q.seq),
      expr: String(q.expr),
      userAnswer: String(q.userAnswer),
      correctAnswer: Number(q.correctAnswer),
      isCorrect: !!q.isCorrect,
      timeMs: Number(q.timeMs),
    })),
  })
})
