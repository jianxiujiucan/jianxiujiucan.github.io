<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

// 登录/注册 tab，默认登录；?tab=register 可直达注册表单
const tab = ref<"login" | "register">(
  route.query.tab === "register" ? "register" : "login"
);

function switchTab(t: "login" | "register") {
  tab.value = t;
  // 同步到 URL query（保留 redirect 等参数），刷新后保持当前 tab
  router.replace({
    query: { ...route.query, tab: t === "login" ? undefined : "register" },
  });
}
</script>

<template>
  <h1>口算答题器</h1>
  <div class="login">
    <template v-if="auth.state.user">
      <p class="hello">你好，{{ auth.state.user.username }}！</p>
      <button class="primary-btn" @click="router.push('/setup')">
        开始答题
      </button>
      <p class="bottom-row">
        <button class="link-btn" @click="auth.logout()">退出登录</button>
      </p>
    </template>
    <template v-else>
      <div class="auth-tabs">
        <span
          class="auth-tab"
          :class="{ active: tab === 'login' }"
          @click="switchTab('login')"
        >
          登 录
        </span>
        <span
          class="auth-tab"
          :class="{ active: tab === 'register' }"
          @click="switchTab('register')"
        >
          注 册
        </span>
      </div>
      <LoginForm v-if="tab === 'login'" @switch="switchTab('register')" />
      <RegisterForm v-else @switch="switchTab('login')" />
    </template>
  </div>
  <div v-if="!auth.state.user" class="guest-row">
    <span class="link-btn guest-btn" @click="router.push('/setup')">
      访客模式，随便玩玩 ›
    </span>
  </div>
  <!-- <p class="tip">适合小学一、二年级口算练习</p> -->
</template>

<style scoped lang="scss">
@use "../styles/variables" as *;

.login {
  display: flex;
  flex-direction: column;
  background: var(--m-bg);
  border-radius: 0.16rem;
  padding: 0.22rem 0.18rem;
  box-shadow: var(--m-card-shadow);
}

.hello {
  text-align: center;
  font-size: 0.17rem;
  font-weight: 600;
  color: var(--m-text-main);
  margin-bottom: 0.16rem;
}

.auth-tabs {
  display: flex;

  margin-bottom: 0.16rem;
}

.auth-tab {
  position: relative;
  flex: 1;
  background: none;
  border: none;
  padding: 0.02rem 0 0.1rem;
  font-size: 0.16rem;
  color: var(--m-text-muted);
  cursor: pointer;

  margin-bottom: -0.01rem;
  text-align: center;

  &.active {
    color: var(--m-primary);
    font-weight: 700;

    &:after {
      position: absolute;
      width: 15%;
      left: 50%;
      transform: translateX(-50%);
      height: 0.05rem;
      content: "";
      display: block;
      height: 0.02rem;
      background-color: var(--m-primary);
      margin-top: 0.06rem;
      border-radius: 0.03rem;
    }
  }
}

.bottom-row {
  text-align: center;
  margin-top: 0.16rem;
  font-size: 0.14rem;
}

// 访客入口：不显眼的小字链接
.guest-row {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 0.14rem;
}

.guest-btn {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.13rem;
}
</style>
