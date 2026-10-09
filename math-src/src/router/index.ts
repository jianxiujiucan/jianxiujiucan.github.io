import { createRouter, createWebHashHistory } from "vue-router";
import EntryView from "@/views/EntryView.vue";
import SetupView from "@/views/SetupView.vue";
import { useAuthStore } from "@/stores/auth";
import { useQuizStore } from "@/stores/quiz";

const router = createRouter({
  // GitHub Pages 无服务端回退，必须使用 hash 模式
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // 首页即登录/注册（tab 切换），已登录则显示问候
    { path: "/", name: "entry", component: EntryView },
    // 答题设置页（保留 name='setup'，/quiz 的 beforeEnter 无需改动）
    { path: "/setup", name: "setup", component: SetupView },
    {
      path: "/quiz",
      name: "quiz",
      component: () => import("@/views/QuizView.vue"),
      beforeEnter: () => {
        // 直接访问 #/quiz 或刷新页面（store 已清空）时回到设置页
        const store = useQuizStore();
        if (store.state.questions.length === 0) return { name: "setup" };
      },
    },
    // 登录/注册已并入首页 tab，旧链接重定向防失效
    {
      path: "/login",
      redirect: (to) => ({
        name: "entry",
        query: to.query.redirect ? { redirect: to.query.redirect } : {},
      }),
    },
    {
      path: "/register",
      redirect: (to) => ({
        name: "entry",
        query: {
          tab: "register",
          ...(to.query.redirect ? { redirect: to.query.redirect } : {}),
        },
      }),
    },
    {
      path: "/forgot",
      name: "forgot",
      component: () => import("@/views/ForgotView.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@/views/ProfileView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/profile/sessions/:id",
      name: "session-detail",
      component: () => import("@/views/SessionDetailView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/leaderboard",
      name: "leaderboard",
      component: () => import("@/views/LeaderboardView.vue"),
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  // 需登录页面：未登录 → 回首页登录（带上回跳地址）
  if (to.meta.requiresAuth && !auth.state.token) {
    return { name: "entry", query: { redirect: to.fullPath } };
  }
});

export default router;
