<template>
  <main class="page">
    <RouterView v-slot="{ Component }">
      <!-- 缓存答题页：答题中途跳登录/注册再回来时保留作答与结果状态 -->
      <KeepAlive include="QuizView">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </main>
</template>
