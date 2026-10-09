import { Router } from 'express'
import { pool } from '../db'
import { httpError } from '../httpError'
import { OP_TYPES } from '../types'
import type { LeaderboardRow } from '../types'

export const leaderboardRoutes = Router()

/* ---------- 排行榜（公开） ----------
 * 口径：每种运算类型一榜；每用户取「平均每题用时」最佳的一场
 * （每场平均 = 该场各题 time_ms 的 AVG，不含看反馈时间）；
 * 仅正确率 ≥90% 的场次上榜（correct*10 >= total*9，防乱按秒答刷榜）；
 * 并列先达成者在前；前 50。
 */
leaderboardRoutes.get('/', async (req, res) => {
  const opType = String(req.query.op_type ?? '')
  if (!(OP_TYPES as readonly string[]).includes(opType)) {
    throw httpError(400, 'INVALID_OP_TYPE', '运算类型不合法')
  }

  const { rows } = await pool.query<LeaderboardRow>(
    `WITH session_avg AS (
       SELECT s.id, s.user_id, s.total, s.created_at, AVG(r.time_ms) AS avg_ms
       FROM quiz_sessions s
       JOIN question_records r ON r.session_id = s.id
       WHERE s.op_type = $1 AND s.correct * 10 >= s.total * 9
       GROUP BY s.id, s.user_id, s.total, s.created_at
     ),
     best AS (
       SELECT sa.*,
              ROW_NUMBER() OVER (
                PARTITION BY sa.user_id
                ORDER BY sa.avg_ms ASC, sa.created_at ASC
              ) AS rn
       FROM session_avg sa
     )
     SELECT u.username, ROUND(b.avg_ms) AS "avgMs", b.total, b.created_at AS "createdAt"
     FROM best b
     JOIN users u ON u.id = b.user_id
     WHERE b.rn = 1
     ORDER BY b.avg_ms ASC, b.created_at ASC
     LIMIT 50`,
    [opType]
  )

  res.json({
    opType,
    list: rows.map((r, i) => ({
      rank: i + 1,
      username: r.username,
      avgMs: Number(r.avgMs),
      total: r.total,
      createdAt: r.createdAt,
    })),
  })
})
