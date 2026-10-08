import { reactive } from 'vue'
import type { Question, QuizConfig } from '@/types/quiz'
import { generateQuestions } from '@/utils/generator'

interface QuizState {
  config: QuizConfig | null
  questions: Question[]
  /** 当前题索引（0 起） */
  current: number
  /** 已答对数 */
  correct: number
}

// 模块级单例：跨路由共享（设置页写入，答题页读取）。
// 后续登录功能可用同模式加 stores/auth.ts；状态复杂度上升再迁 Pinia。
const state = reactive<QuizState>({
  config: null,
  questions: [],
  current: 0,
  correct: 0,
})

export function useQuizStore() {
  function startQuiz(config: QuizConfig) {
    state.config = { ...config }
    state.questions = generateQuestions(config)
    state.current = 0
    state.correct = 0
  }

  function markCorrect() {
    state.correct++
  }

  function nextQuestion() {
    if (state.current < state.questions.length - 1) state.current++
  }

  function reset() {
    state.config = null
    state.questions = []
    state.current = 0
    state.correct = 0
  }

  return { state, startQuiz, markCorrect, nextQuestion, reset }
}
