<script setup lang="ts">
import { ref, watch } from "vue";
import PillGroup from "@/components/PillGroup.vue";
import { fetchLeaderboardApi } from "@/api";
import { ApiError } from "@/api/http";
import type { LeaderboardItem } from "@/types/api";
import type { OpType } from "@/types/quiz";
import { opTypeOptions } from "@/utils/options";
import { formatDate, formatMsPerQ } from "@/utils/format";

const opType = ref<OpType>("add");
const list = ref<LeaderboardItem[]>([]);
const loading = ref(false);
const errorMsg = ref("");

async function load() {
  loading.value = true;
  errorMsg.value = "";
  try {
    const r = await fetchLeaderboardApi(opType.value);
    list.value = r.list;
  } catch (e) {
    list.value = [];
    errorMsg.value = e instanceof ApiError ? e.message : "加载失败，请稍后再试";
  } finally {
    loading.value = false;
  }
}

watch(opType, load, { immediate: true });
</script>

<template>
  <h1>排行榜</h1>
  <div class="card">
    <PillGroup v-model="opType" :options="opTypeOptions" label="运算类型" />
    <p class="rule">按「平均每题用时」排名，仅正确率 ≥90% 的场次上榜</p>

    <div v-if="errorMsg" class="form-error">{{ errorMsg }}</div>
    <p v-else-if="loading" class="state-text">加载中…</p>
    <p v-else-if="list.length === 0" class="state-text">暂无记录，快来上榜！</p>

    <div v-else class="rank-list">
      <div v-for="item in list" :key="item.username" class="rank-row">
        <span class="rank-badge" :class="'r' + item.rank">{{ item.rank }}</span>
        <span class="rank-name">{{ item.username }}</span>
        <span class="rank-time">{{ formatMsPerQ(item.avgMs) }}</span>
        <span class="rank-meta"
          >{{ item.total }}题 · {{ formatDate(item.createdAt) }}</span
        >
      </div>
    </div>
  </div>
  <!-- <p class="tip"><router-link to="/" class="link">‹ 返回首页</router-link></p> -->
</template>

<style scoped lang="scss">
@use "../styles/variables" as *;

.rule {
  font-size: 0.12rem;
  color: $text-muted;
  margin: -0.06rem 0 0.12rem;
}

.state-text {
  text-align: center;
  color: $text-muted;
  font-size: 0.14rem;
  padding: 0.16rem 0;
}

.rank-row {
  display: flex;
  align-items: center;
  gap: 0.08rem;
  padding: 0.08rem 0.02rem;
  border-bottom: 0.01rem solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.rank-badge {
  width: 0.26rem;
  height: 0.26rem;
  border-radius: 50%;
  text-align: center;
  line-height: 0.26rem;
  font-size: 0.14rem;
  font-weight: 800;
  color: #fff;
  background: #c9d4e5;
  flex-shrink: 0;

  &.r1 {
    background: #f5b942; // 金
  }

  &.r2 {
    background: #a8b8c8; // 银
  }

  &.r3 {
    background: #d29a7b; // 铜
  }
}

.rank-name {
  font-size: 0.15rem;
  font-weight: 700;
  color: $text-main;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-time {
  margin-left: auto;
  font-size: 0.15rem;
  font-weight: 800;
  color: $primary;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.rank-meta {
  font-size: 0.12rem;
  color: $text-muted;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
</style>
