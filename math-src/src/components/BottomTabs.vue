<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 个人中心详情页（/profile/sessions/:id）也算个人中心 tab 激活
const active = computed(() => {
  if (route.path.startsWith('/leaderboard')) return 'leaderboard'
  if (route.path.startsWith('/profile')) return 'profile'
  return ''
})
</script>

<template>
  <nav class="bottom-tabs">
    <router-link to="/leaderboard" class="tab" :class="{ active: active === 'leaderboard' }">
      <span class="tab-icon">🏆</span>
      <span class="tab-label">排行榜</span>
    </router-link>
    <router-link to="/profile" class="tab" :class="{ active: active === 'profile' }">
      <span class="tab-icon">👤</span>
      <span class="tab-label">个人中心</span>
    </router-link>
  </nav>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

.bottom-tabs {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 3.75rem; // 与 .page 同宽
  display: flex;
  background: #fff;
  box-shadow: 0 -0.02rem 0.12rem rgba(0, 0, 0, 0.12);
  z-index: 20;
}

.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.02rem;
  padding: 0.07rem 0 0.06rem;
  text-decoration: none;
  color: $text-muted;
  opacity: 0.6;

  &.active {
    color: $primary;
    font-weight: 600;
    opacity: 1;
  }
}

.tab-icon {
  font-size: 0.2rem;
  line-height: 1;
}

.tab-label {
  font-size: 0.12rem;
}

@media (min-width: 520px) {
  .bottom-tabs {
    max-width: 5rem; // 与 .page 桌面宽度一致
  }
}
</style>
