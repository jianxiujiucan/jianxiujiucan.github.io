<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ApiError } from '@/api/http'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

// 用户名输入即规范：大写 + 仅字母数字
function onUsernameInput(e: Event) {
  const input = e.target as HTMLInputElement
  const v = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20)
  input.value = v
  username.value = v
}

async function submit() {
  errorMsg.value = ''
  if (!username.value || !password.value) {
    errorMsg.value = '请输入用户名和密码'
    return
  }
  loading.value = true
  try {
    await auth.login(username.value, password.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.push(redirect)
  } catch (e) {
    errorMsg.value = e instanceof ApiError ? e.message : '登录失败，请稍后再试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <h1>登 录</h1>
  <div class="card">
    <form @submit.prevent="submit">
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
          placeholder="大写字母或数字"
          @input="onUsernameInput"
        />
      </div>

      <div class="form-item">
        <label class="form-label" for="login-password">密码</label>
        <input
          id="login-password"
          v-model="password"
          class="text-input"
          type="password"
          autocomplete="current-password"
          placeholder="请输入密码"
        />
      </div>

      <button class="primary-btn" type="submit" :disabled="loading">
        {{ loading ? '登录中…' : '登 录' }}
      </button>
    </form>

    <p class="bottom-links">
      <router-link :to="{ name: 'register', query: route.query }" class="link">
        没有账号？去注册
      </router-link>
      <router-link to="/forgot" class="link">忘记密码？</router-link>
    </p>
  </div>
  <p class="tip"><router-link to="/" class="link">‹ 返回首页</router-link></p>
</template>

<style scoped lang="scss">
.bottom-links {
  display: flex;
  justify-content: space-between;
  margin-top: 0.16rem;
  font-size: 0.14rem;
}
</style>
