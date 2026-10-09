<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

// 入口页不主动调任何 API：线上无后端时零报错噪音，访客路径完全离线可用
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
      <button class="primary-btn" @click="router.push('/setup')">
        访客模式：直接开始答题
      </button>
      <div class="divider"><span>注册用户</span></div>
      <button class="secondary-btn" @click="router.push('/login')">
        登 录
      </button>
      <button class="secondary-btn" @click="router.push('/register')">
        注册新账号
      </button>
    </template>
  </div>
  <p class="tip">适合小学一、二年级口算练习</p>
</template>

<style scoped lang="scss">
@use "../styles/variables" as *;

.login {
  background: var(--m-bg);
  border-radius: 0.16rem;
  padding: 0.22rem 0.18rem;
  box-shadow: var(--m-card-shadow);
}

.hello {
  text-align: center;
  font-size: 0.17rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 0.16rem;
}

.divider {
  display: flex;
  align-items: center;
  margin: 0.18rem 0 0.02rem;
  color: $text-muted;
  font-size: 0.13rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-top: 0.01rem solid #e5e5e5;
  }

  span {
    padding: 0 0.1rem;
  }
}

.bottom-row {
  text-align: center;
  margin-top: 0.16rem;
  font-size: 0.14rem;
}
</style>
