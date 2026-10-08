import { createRouter, createWebHashHistory } from 'vue-router'
import SetupView from '@/views/SetupView.vue'
import { useQuizStore } from '@/stores/quiz'

const router = createRouter({
  // GitHub Pages 无服务端回退，必须使用 hash 模式
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'setup', component: SetupView },
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
    // 路线图上预留：/login、/register（注册登录功能）
    // { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    // { path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
