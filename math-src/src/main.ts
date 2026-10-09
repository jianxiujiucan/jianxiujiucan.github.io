import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { setUnauthorizedHandler } from "./api/http";
import "./styles/global.scss";

// API 返回 401（token 过期/失效）时自动回首页登录
setUnauthorizedHandler(() => {
  const current = router.currentRoute.value;
  if (current.name !== "entry") {
    void router.push({ name: "entry", query: { redirect: current.fullPath } });
  }
});

createApp(App).use(router).mount("#app");
