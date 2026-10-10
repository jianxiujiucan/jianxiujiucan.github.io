<script setup lang="ts">
import { ref } from 'vue'
import PasswordInput from '@/components/PasswordInput.vue'
import { adminResetPasswordApi } from '@/api'
import { ApiError } from '@/api/http'
import { passwordError, usernameError } from '@/utils/validate'

// 管理页（不进 Tab 栏，家长收藏 URL 使用）：为用户重置密码
const adminToken = ref('')
const username = ref('')
const newPassword = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const loading = ref(false)

function onUsernameInput(e: Event) {
  const input = e.target as HTMLInputElement
  const v = input.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 20)
  input.value = v
  username.value = v
}

async function submit() {
  errorMsg.value = ''
  successMsg.value = ''
  if (!adminToken.value) {
    errorMsg.value = '请输入管理口令'
    return
  }
  const uErr = usernameError(username.value)
  if (uErr) {
    errorMsg.value = uErr
    return
  }
  const pErr = passwordError(newPassword.value)
  if (pErr) {
    errorMsg.value = pErr
    return
  }
  loading.value = true
  try {
    const r = await adminResetPasswordApi(username.value, newPassword.value, adminToken.value)
    successMsg.value = r.message
    username.value = ''
    newPassword.value = ''
  } catch (e) {
    errorMsg.value = e instanceof ApiError ? e.message : '操作失败，请稍后再试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <h1>管理后台</h1>
  <div class="card">
    <p class="desc">为用户重置密码（用户忘记密码时使用）。</p>
    <form @submit.prevent="submit">
      <div v-if="errorMsg" class="form-error">{{ errorMsg }}</div>
      <div v-if="successMsg" class="form-success">{{ successMsg }}</div>

      <div class="form-item">
        <label class="form-label" for="admin-token">管理口令</label>
        <PasswordInput
          id="admin-token"
          v-model="adminToken"
          autocomplete="off"
          placeholder="管理员专用口令"
        />
      </div>

      <div class="form-item">
        <label class="form-label" for="admin-username">要重置的用户名</label>
        <input
          id="admin-username"
          class="text-input"
          type="text"
          :value="username"
          maxlength="20"
          autocomplete="off"
          placeholder="大写字母或数字"
          @input="onUsernameInput"
        />
      </div>

      <div class="form-item">
        <label class="form-label" for="admin-password">新密码</label>
        <PasswordInput
          id="admin-password"
          v-model="newPassword"
          autocomplete="off"
          placeholder="8 位以上，字母+数字组合"
        />
      </div>

      <button class="primary-btn" type="submit" :disabled="loading">
        {{ loading ? '提交中…' : '重置密码' }}
      </button>
    </form>
  </div>
  <p class="tip">此页面仅管理员使用</p>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

.desc {
  font-size: 0.14rem;
  color: $text-sub;
  margin-bottom: 0.14rem;
  line-height: 1.5;
}

.form-success {
  background: #f0fff4;
  border: 0.01rem solid #b7eb8f;
  color: $success;
  font-size: 0.14rem;
  border-radius: 0.08rem;
  padding: 0.08rem 0.12rem;
  margin-bottom: 0.12rem;
}
</style>
