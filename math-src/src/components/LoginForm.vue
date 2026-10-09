<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PasswordInput from "@/components/PasswordInput.vue";
import { useAuthStore } from "@/stores/auth";
import { ApiError } from "@/api/http";

// 切换到注册 tab（由父组件 EntryView 处理）
const emit = defineEmits<{ switch: [] }>();

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const username = ref("");
const password = ref("");
const errorMsg = ref("");
const loading = ref(false);

// 用户名输入即规范：大写 + 仅字母数字
function onUsernameInput(e: Event) {
  const input = e.target as HTMLInputElement;
  const v = input.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 20);
  input.value = v;
  username.value = v;
}

async function submit() {
  errorMsg.value = "";
  if (!username.value || !password.value) {
    errorMsg.value = "请输入用户名和密码";
    return;
  }
  loading.value = true;
  try {
    await auth.login(username.value, password.value);
    // 默认进入答题设置页；带 redirect（如中途去登录）则回跳
    const redirect =
      typeof route.query.redirect === "string"
        ? route.query.redirect
        : "/setup";
    router.push(redirect);
  } catch (e) {
    errorMsg.value = e instanceof ApiError ? e.message : "登录失败，请稍后再试";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="submit" class="login-form">
    <div v-if="errorMsg" class="form-error">{{ errorMsg }}</div>

    <div class="form-item">
      <label class="form-label" for="login-username">用户名</label>
      <input
        id="login-username"
        class="text-input"
        type="text"
        :value="username"
        maxlength="20"
        autocomplete="username"
        placeholder="请输入用户名"
        @input="onUsernameInput"
      />
    </div>

    <div class="form-item">
      <label class="form-label" for="login-password">密码</label>
      <PasswordInput
        id="login-password"
        v-model="password"
        autocomplete="current-password"
        placeholder="请输入密码"
      />
    </div>

    <button class="primary-btn" type="submit" :disabled="loading">
      {{ loading ? "登录中…" : "登 录" }}
    </button>
  </form>

  <p class="bottom-links">
    <button type="button" class="link-btn" @click="emit('switch')">
      没有账号？去注册
    </button>
    <router-link to="/forgot" class="link">忘记密码？</router-link>
  </p>
</template>

<style scoped lang="scss">
.bottom-links {
  display: flex;
  justify-content: space-between;
  margin-top: 0.16rem;
  font-size: 0.14rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 0.14rem;
}

.primary-btn {
  margin: 0.3rem 0 0;
}
</style>
