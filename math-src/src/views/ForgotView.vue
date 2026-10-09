<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PasswordInput from '@/components/PasswordInput.vue'
import { forgotApi, resetApi } from '@/api'
import { ApiError } from '@/api/http'
import { emailError, passwordError } from '@/utils/validate'

const router = useRouter()

const step = ref<1 | 2>(1)
const done = ref(false)

const email = ref('')
const code = ref('')
const newPassword = ref('')
const confirm = ref('')

const errorMsg = ref('')
const loading = ref(false)
const cooldown = ref(0) // 重发倒计时（秒）
let timer: ReturnType<typeof setInterval> | undefined

const emailErr = computed(() => emailError(email.value))

function startCooldown() {
  cooldown.value = 60
  timer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0 && timer) {
      clearInterval(timer)
      timer = undefined
    }
  }, 1000)
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

async function sendCode() {
  errorMsg.value = ''
  if (emailErr.value) return
  loading.value = true
  try {
    await forgotApi(email.value.trim().toLowerCase())
    step.value = 2
    startCooldown()
  } catch (e) {
    errorMsg.value = e instanceof ApiError ? e.message : '发送失败，请稍后再试'
  } finally {
    loading.value = false
  }
}

// 验证码输入即过滤非数字
function onCodeInput(e: Event) {
  const input = e.target as HTMLInputElement
  const v = input.value.replace(/\D/g, '').slice(0, 6)
  input.value = v
  code.value = v
}

const newPasswordErr = computed(() => passwordError(newPassword.value))
const confirmErr = computed(() =>
  !confirm.value ? '请再次输入密码' : confirm.value === newPassword.value ? '' : '两次输入的密码不一致'
)

async function submit() {
  errorMsg.value = ''
  if (code.value.length !== 6) {
    errorMsg.value = '请输入 6 位验证码'
    return
  }
  if (newPasswordErr.value || confirmErr.value) {
    errorMsg.value = newPasswordErr.value || confirmErr.value
    return
  }
  loading.value = true
  try {
    await resetApi(email.value.trim().toLowerCase(), code.value, newPassword.value)
    done.value = true
  } catch (e) {
    errorMsg.value = e instanceof ApiError ? e.message : '重置失败，请稍后再试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <h1>找回密码</h1>
  <div class="card">
    <!-- 完成态 -->
    <template v-if="done">
      <p class="success-text">密码已重置 ✓</p>
      <button class="primary-btn" @click="router.push('/')">去登录</button>
    </template>

    <!-- 第一步：输邮箱发验证码 -->
    <form v-else-if="step === 1" @submit.prevent="sendCode">
      <p class="desc">输入注册时绑定的邮箱，我们将发送 6 位验证码。</p>
      <div v-if="errorMsg" class="form-error">{{ errorMsg }}</div>
      <div class="form-item">
        <label class="form-label" for="forgot-email">邮箱</label>
        <input
          id="forgot-email"
          v-model="email"
          class="text-input"
          :class="{ 'input-error': email && emailErr }"
          type="email"
          autocomplete="email"
          placeholder="example@qq.com"
        />
        <div class="field-msg">{{ email ? emailErr : '' }}</div>
      </div>
      <button class="primary-btn" type="submit" :disabled="loading || !!emailErr">
        {{ loading ? '发送中…' : '发送验证码' }}
      </button>
    </form>

    <!-- 第二步：验证码 + 新密码 -->
    <form v-else @submit.prevent="submit">
      <p class="desc">
        验证码已发送至 <b>{{ email }}</b>（如已注册）。开发模式下请查看后端控制台输出。
      </p>
      <div v-if="errorMsg" class="form-error">{{ errorMsg }}</div>
      <div class="form-item">
        <label class="form-label" for="forgot-code">验证码</label>
        <input
          id="forgot-code"
          class="text-input code-input"
          type="text"
          :value="code"
          inputmode="numeric"
          maxlength="6"
          autocomplete="off"
          placeholder="6 位数字"
          @input="onCodeInput"
        />
      </div>
      <div class="form-item">
        <label class="form-label" for="forgot-password">新密码</label>
        <PasswordInput
          id="forgot-password"
          v-model="newPassword"
          autocomplete="new-password"
          placeholder="8 位以上，字母+数字组合"
          :state="newPassword && newPasswordErr ? 'error' : ''"
        />
        <div class="field-msg">{{ newPassword ? newPasswordErr : '' }}</div>
      </div>
      <div class="form-item">
        <label class="form-label" for="forgot-confirm">确认新密码</label>
        <PasswordInput
          id="forgot-confirm"
          v-model="confirm"
          autocomplete="new-password"
          placeholder="再输入一次新密码"
          :state="confirm && confirmErr ? 'error' : ''"
        />
        <div class="field-msg">{{ confirm ? confirmErr : '' }}</div>
      </div>
      <button class="primary-btn" type="submit" :disabled="loading">
        {{ loading ? '提交中…' : '重置密码' }}
      </button>
      <button class="secondary-btn" type="button" :disabled="cooldown > 0" @click="sendCode">
        {{ cooldown > 0 ? `重新发送 (${cooldown}s)` : '重新发送' }}
      </button>
    </form>
  </div>
  <p class="tip"><router-link to="/" class="link">‹ 返回登录</router-link></p>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

.desc {
  font-size: 0.14rem;
  color: $text-sub;
  margin-bottom: 0.14rem;
  line-height: 1.5;
}

.code-input {
  letter-spacing: 0.08rem;
  font-weight: 700;
}

.success-text {
  text-align: center;
  font-size: 0.17rem;
  font-weight: 600;
  color: $success;
  margin-bottom: 0.16rem;
}
</style>
