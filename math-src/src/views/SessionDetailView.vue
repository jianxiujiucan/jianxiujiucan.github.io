<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchSessionDetailApi } from '@/api'
import { ApiError } from '@/api/http'
import type { SessionDetailResponse } from '@/types/api'
import { formatDateTime, formatDuration, formatMs, opTypeLabel } from '@/utils/format'

const route = useRoute()

const detail = ref<SessionDetailResponse | null>(null)
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    detail.value = await fetchSessionDetailApi(id)
  } catch (e) {
    errorMsg.value = e instanceof ApiError ? e.message : '加载失败，请稍后再试'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <h1>答题详情</h1>

  <div v-if="errorMsg" class="form-error">{{ errorMsg }}</div>
  <p v-if="loading" class="loading-text">加载中…</p>

  <template v-else-if="detail">
    <!-- 摘要卡 -->
    <div class="card summary-card">
      <div class="summary-score">{{ detail.session.score }} 分</div>
      <div class="summary-meta">
        {{ opTypeLabel(detail.session.opType) }} · {{ detail.session.range }}以内 ·
        {{ detail.session.count }}题
      </div>
      <div class="summary-meta">
        对 {{ detail.session.correct }}/{{ detail.session.total }} 题 · 用时
        {{ formatDuration(detail.session.durationMs) }}
      </div>
      <div class="summary-meta time">{{ formatDateTime(detail.session.createdAt) }}</div>
    </div>

    <!-- 每题明细 -->
    <div class="card">
      <div class="card-title">每题作答</div>
      <div
        v-for="q in detail.questions"
        :key="q.seq"
        class="q-row"
        :class="{ wrong: !q.isCorrect }"
      >
        <span class="q-seq">({{ q.seq }})</span>
        <span class="q-expr">{{ q.expr }} = <b>{{ q.userAnswer || '?' }}</b></span>
        <span class="q-mark">{{ q.isCorrect ? '✓' : '✗' }}</span>
        <span v-if="!q.isCorrect" class="q-answer">答案：{{ q.correctAnswer }}</span>
        <span class="q-time">{{ formatMs(q.timeMs) }}</span>
      </div>
    </div>
  </template>

  <p class="tip"><router-link to="/profile" class="link">‹ 返回个人中心</router-link></p>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

.loading-text {
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.15rem;
}

.card {
  margin-bottom: 0.14rem;
}

.summary-card {
  text-align: center;
}

.summary-score {
  font-size: 0.36rem;
  font-weight: 800;
  color: $accent-to;
}

.summary-meta {
  font-size: 0.14rem;
  color: $text-sub;
  margin-top: 0.04rem;

  &.time {
    color: $text-muted;
    font-size: 0.12rem;
    font-variant-numeric: tabular-nums;
  }
}

.card-title {
  font-size: 0.15rem;
  font-weight: 600;
  color: $text-sub;
  margin-bottom: 0.06rem;
}

.q-row {
  display: flex;
  align-items: baseline;
  gap: 0.06rem;
  padding: 0.07rem 0.02rem;
  border-bottom: 0.01rem solid #f5f5f5;
  font-size: 0.15rem;

  &:last-child {
    border-bottom: none;
  }
}

.q-seq {
  color: $text-muted;
  font-size: 0.13rem;
}

.q-expr {
  color: $text-main;
  font-weight: 600;
  white-space: nowrap;
}

.q-mark {
  font-weight: 800;
  color: $success;

  .wrong & {
    color: $danger;
  }
}

.q-answer {
  color: $danger;
  font-size: 0.13rem;
  font-weight: 600;
}

.q-time {
  margin-left: auto;
  color: $text-muted;
  font-size: 0.13rem;
  font-variant-numeric: tabular-nums;
}
</style>
