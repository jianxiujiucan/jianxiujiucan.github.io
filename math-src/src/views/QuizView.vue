<script setup lang="ts">
import { computed, nextTick, onActivated, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import SoundToggle from "@/components/SoundToggle.vue";
import { useSound } from "@/composables/useSound";
import { useTimer } from "@/composables/useTimer";
import { useAuthStore } from "@/stores/auth";
import { useQuizStore } from "@/stores/quiz";
import { saveSessionApi } from "@/api";
import { exprText } from "@/utils/generator";
import type { QuestionRecordDto } from "@/types/api";

const router = useRouter();
const store = useQuizStore();
const auth = useAuthStore();
const { display, start, stop } = useTimer();
const { play } = useSound();

// 局部 UI 状态（不进 store）
const answer = ref("");
const answered = ref(false);
const lastRight = ref(false);
const finished = ref(false);
const inputEl = ref<HTMLInputElement>();

// 每题用时采集与成绩保存
const records = ref<QuestionRecordDto[]>([]);
let questionStart = 0; // performance.now() 时间戳
let quizStart = 0;
const durationMs = ref(0);
const saveState = ref<"guest" | "saving" | "saved" | "failed">("guest");

const total = computed(() => store.state.questions.length);
const currentQ = computed(() => store.state.questions[store.state.current]);
const progress = computed(() => `${store.state.current + 1}/${total.value}`);
const expr = computed(() => `${exprText(currentQ.value)} =`);
const answerLen = computed(() => String(currentQ.value.answer).length);
const isLast = computed(() => store.state.current === total.value - 1);

// 满分 100，按正确比例扣分，四舍五入取整
const score = computed(() =>
  Math.round((store.state.correct / total.value) * 100)
);
const cheer = computed(() =>
  score.value === 100
    ? "太棒了，满分！🎉"
    : score.value >= 80
    ? "很棒，继续加油！"
    : score.value >= 60
    ? "不错，再练练会更好！"
    : "别灰心，多多练习！"
);
const summary = computed(
  () => `答对 ${store.state.correct}/${total.value} 题 · 用时 ${display.value}`
);

function focusInput() {
  nextTick(() => inputEl.value?.focus());
}

/* 组件被 KeepAlive 缓存：路由回来不会重建。
 * 以 store.quizId 识别「新的一场」，只有新的一场才重置局部状态。 */
const localQuizId = ref(0);

function syncWithStore() {
  if (localQuizId.value === store.state.quizId) return;
  localQuizId.value = store.state.quizId;
  records.value = [];
  answer.value = "";
  answered.value = false;
  finished.value = false;
  saveState.value = "guest";
  start();
  questionStart = performance.now();
  quizStart = questionStart;
  focusInput();
}

onMounted(syncWithStore);
onActivated(syncWithStore);

// 切到下一题时重置作答状态并聚焦输入框
watch(
  () => store.state.current,
  () => {
    answer.value = "";
    answered.value = false;
    questionStart = performance.now();
    focusInput();
  }
);

// 答题中途去登录：回来后若成绩还没保存，自动补传
watch(
  () => auth.state.token,
  (t) => {
    if (t && finished.value && saveState.value === "guest") {
      void saveResult();
    }
  }
);

// 输入即过滤非数字字符；输入位数达到答案位数时自动判题
function onInput(e: Event) {
  const input = e.target as HTMLInputElement;
  const v = input.value.replace(/\D/g, "").slice(0, 3);
  input.value = v;
  answer.value = v;
  if (answered.value) return;
  if (v.length > 0 && v.length >= answerLen.value) {
    checkAnswer();
  }
}

function tryCheck() {
  if (answered.value) return;
  if (answer.value === "") return;
  checkAnswer();
}

function checkAnswer() {
  if (answered.value) return;
  answered.value = true;

  const q = currentQ.value;
  const right = parseInt(answer.value, 10) === q.answer;
  lastRight.value = right;

  // 采集本题用时与作答明细
  const timeMs = Math.round(performance.now() - questionStart);
  records.value.push({
    seq: store.state.current + 1,
    expr: exprText(q),
    userAnswer: answer.value,
    correctAnswer: q.answer,
    isCorrect: right,
    timeMs,
  });

  if (right) {
    store.markCorrect();
    play("correct");
  } else {
    play("error");
  }

  if (isLast.value) {
    finished.value = true;
    stop();
    durationMs.value = Math.round(performance.now() - quizStart);
    void saveResult(); // 答完最后一题整体上传一次
  }
}

async function saveResult() {
  if (!auth.state.token || !store.state.config) {
    saveState.value = "guest";
    return;
  }
  saveState.value = "saving";
  try {
    await saveSessionApi({
      config: store.state.config,
      durationMs: durationMs.value,
      questions: records.value,
    });
    saveState.value = "saved";
  } catch {
    saveState.value = "failed"; // 静默降级：仅结果区提示，可手动重试
  }
}

function nextQuestion() {
  store.nextQuestion();
}

function goHome() {
  store.reset();
  router.push("/");
}
</script>

<template>
  <div class="quiz-header">
    <span class="badge">{{ progress }}</span>
    <span class="badge">{{ display }}</span>
  </div>

  <div class="card question-card">
    <div class="question-line">
      <span class="number">({{ store.state.current + 1 }})</span>
      <p class="question-text">{{ expr }}</p>
      <input
        ref="inputEl"
        class="answer-input"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength="3"
        autocomplete="off"
        placeholder="?"
        :value="answer"
        :disabled="answered"
        @input="onInput"
        @keydown.enter.prevent="tryCheck"
      />
      <span
        class="result-icon"
        :class="{ right: answered && lastRight, wrong: answered && !lastRight }"
        >{{ answered ? (lastRight ? "✓" : "✗") : "" }}</span
      >
    </div>
    <div v-show="answered && !lastRight" class="feedback">
      正确答案：{{ expr }} {{ currentQ.answer }}
    </div>
    <button v-show="!answered" class="secondary-btn" @click="tryCheck">
      确定
    </button>
  </div>

  <button
    v-if="answered && !isLast"
    class="primary-btn next-btn"
    @click="nextQuestion"
  >
    下一题
  </button>

  <div v-if="finished" class="card result-area">
    <div class="result-title">本次得分</div>
    <div class="score-text">{{ score }} 分</div>
    <div class="cheer-text">{{ cheer }}</div>
    <div class="summary-text">{{ summary }}</div>
    <div class="save-tip">
      <template v-if="saveState === 'saved'">
        成绩已保存 ✓
        <router-link to="/profile" class="link">查看个人中心</router-link>
      </template>
      <template v-else-if="saveState === 'saving'">成绩保存中…</template>
      <template v-else-if="saveState === 'failed'">
        成绩保存失败 <button class="link-btn" @click="saveResult">重试</button>
      </template>
      <template v-else>
        <router-link
          :to="{ name: 'login', query: { redirect: '/quiz' } }"
          class="link"
        >
          登录后可保存成绩
        </router-link>
      </template>
    </div>
    <button class="primary-btn" @click="goHome">返回首页</button>
  </div>

  <SoundToggle />
</template>

<style scoped lang="scss">
@use "../styles/variables" as *;

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1rem 0.05rem 0.16rem;
}

.badge {
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
  font-size: 0.17rem;
  font-weight: 700;
  padding: 0.06rem 0.16rem;
  border-radius: 9.99rem;
  min-width: 0.76rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.question-card {
  position: relative;
  padding: 0.5rem 0.2rem;
  height: 1.5rem;
}

.question-line {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  padding: 0 0 0 0.16rem;
  font-size: 0.26rem;
  font-weight: 700;
  color: $text-main;
}

.number {
  color: $text-muted;
}

.question-text {
  white-space: nowrap;
}

.answer-input {
  width: 0.7rem;
  padding: 0.04rem 0.08rem;
  font-size: 0.3rem;
  font-weight: 700;
  text-align: center;
  color: $text-main;
  border: 0.02rem solid $primary;
  border-radius: 0.1rem;
  outline: none;
  background: #fff;
  caret-color: $primary;
  margin: 0 0 0 0.08rem;

  &:focus {
    box-shadow: 0 0 0 0.03rem rgba(106, 141, 255, 0.25);
  }

  &:disabled {
    background: #f2f2f2;
    color: #888;
    border-color: #ccc;
  }
}

.secondary-btn {
  display: none;
}

.result-icon {
  width: 0.4rem;
  font-size: 0.26rem;
  font-weight: 800;
  text-align: center;

  &.right {
    color: $success;
  }

  &.wrong {
    color: $danger;
  }
}

.feedback {
  position: absolute;
  bottom: 0.15rem;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 0.18rem;
  font-weight: 600;
  color: $danger;
}

.next-btn {
  margin-top: 0.16rem;
}

.result-area {
  margin-top: 0.16rem;
  text-align: center;
}

.result-title {
  font-size: 0.16rem;
  color: #888;
  font-weight: 600;
}

.score-text {
  font-size: 0.44rem;
  font-weight: 800;
  color: $accent-to;
  margin: 0.06rem 0 0.02rem;
}

.cheer-text {
  font-size: 0.17rem;
  font-weight: 600;
  color: $primary;
  margin-bottom: 0.08rem;
}

.summary-text {
  font-size: 0.15rem;
  color: $text-main;
  margin-bottom: 0.1rem;
  font-variant-numeric: tabular-nums;
}

.save-tip {
  font-size: 0.13rem;
  color: $text-muted;
  margin-bottom: 0.14rem;
  min-height: 0.18rem;
  span {
    color: green;
  }
}

@media (min-width: 520px) {
  .question-line {
    justify-content: center;
  }
}
</style>
