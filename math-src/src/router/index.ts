import { createRouter, createWebHashHistory } from 'vue-router'
import EntryView from '@/views/EntryView.vue'
import SetupView from '@/views/SetupView.vue'
import { useAuthStore } from '@/stores/auth'
import { useQuizStore } from '@/stores/quiz'

const router = createRouter({
  // GitHub Pages 无服务端回退，必须使用 hash 模式
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'entry', component: EntryView },
    // 答题设置页（保留 name='setup'，/quiz 的 beforeEnter 无需改动）
    { path: '/setup', name: 'setup', component: SetupView },
    {
      path: '/quiz',
      name: 'quiz',
      component: () => import('@/views/QuizView.vue'),
      beforeEnter: () => {
        // 直接访问 #/quiz 或刷新页面（store 已清空）时回到设置页
        const store = useQuizStore()
        if (store.state.questions.length === 0) return { name: 'setup' }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/forgot',
      name: 'forgot',
      component: () => import('@/views/ForgotView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/sessions/:id',
      name: 'session-detail',
      component: () => import('@/views/SessionDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import('@/views/LeaderboardView.vue'),
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  // 需登录页面：未登录 → 跳登录页（带上回跳地址）
  if (to.meta.requiresAuth && !auth.state.token) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  // 登录/注册页：已登录 → 回入口页
  if (to.meta.guestOnly && auth.state.token) {
    return { name: 'entry' }
  }
})

export default router
