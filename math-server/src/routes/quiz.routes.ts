import { Router } from 'express'
import type { ResultSetHeader } from 'mysql2'
import { pool } from '../db'
import { requireAuth } from '../auth'
import { httpError } from '../httpError'
import { isValidConfig } from '../validate'
import { evalExpr } from '../expr'
import type { QuestionRecordDto } from '../types'

export const quizRoutes = Router()

/** 单题用时上限（切后台虚高兜底） */
const MAX_QUESTION_MS = 10 * 60 * 1000
/** 整场用时上限 */
const MAX_SESSION_MS = 2 * 60 * 60 * 1000

/* ---------- 提交一次答题成绩（session + 全部题目明细） ---------- */
quizRoutes.post('/', requireAuth, async (req, res) => {
  const body = req.body ?? {}
  if (!isValidConfig(body.config)) throw httpError(400, 'INVALID_CONFIG', '答题配置不合法')
  const cfg = body.config

  const questions = body.questions
  if (!Array.isArray(questions) || questions.length !== cfg.count) {
    throw httpError(400, 'INVALID_QUESTIONS', '题目数据不完整')
  }

  const normalized: QuestionRecordDto[] = []
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i] as QuestionRecordDto
    const seq = Number(q.seq)
    const expr = String(q.expr ?? '')
    const userAnswer = String(q.userAnswer ?? '')
    const correctAnswer = Number(q.correctAnswer)
    const timeMs = Math.min(Math.max(Math.round(Number(q.timeMs) || 0), 0), MAX_QUESTION_MS)

    if (
      seq !== i + 1 ||
      expr.length === 0 ||
      expr.length > 64 ||
      userAnswer.length > 16 ||
      !Number.isInteger(correctAnswer)
    ) {
      throw httpError(400, 'INVALID_QUESTIONS', '题目数据不合法')
    }
    // 服务端复核（不信任客户端）：算式求值必须等于标记答案
    if (evalExpr(expr) !== correctAnswer) {
      throw httpError(400, 'PAYLOAD_MISMATCH', '答案校验失败')
    }
    const realCorrect = Number.parseInt(userAnswer, 10) === correctAnswer
    if (q.isCorrect !== realCorrect) {
      throw httpError(400, 'PAYLOAD_MISMATCH', '对错校验失败')
    }
    normalized.push({
      seq,
      expr,
      userAnswer: userAnswer.slice(0, 16),
      correctAnswer,
      isCorrect: realCorrect,
      timeMs,
    })
  }

  // correct / score 由服务端重算
  const total = normalized.length
  const correct = normalized.filter((q) => q.isCorrect).length
  const score = Math.round((correct / total) * 100)
  const durationMs = Math.min(Math.max(Math.round(Number(body.durationMs) || 0), 0), MAX_SESSION_MS)

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [r] = await conn.query<ResultSetHeader>(
      `INSERT INTO quiz_sessions
         (user_id, count_opt, op_type, range_limit, operands, carry, total, correct, score, duration_ms)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user!.uid,
        cfg.count,
        cfg.opType,
        cfg.range,
        cfg.operands,
        cfg.carry ? 1 : 0,
        total,
        correct,
        score,
        durationMs,
      ]
    )
    const sessionId = r.insertId
    const values = normalized.map((q) => [
      sessionId,
      q.seq,
      q.expr,
      q.userAnswer,
      q.correctAnswer,
      q.isCorrect ? 1 : 0,
      q.timeMs,
    ])
    await conn.query(
      'INSERT INTO question_records (session_id, seq, expr, user_answer, correct_answer, is_correct, time_ms) VALUES ?',
      [values]
    )
    await conn.commit()
    res.status(201).json({ sessionId })
  } catch (e) {
    await conn.rollback()
    throw e
  } finally {
    conn.release()
  }
})
