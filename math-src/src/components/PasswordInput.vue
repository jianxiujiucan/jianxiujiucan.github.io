<script setup lang="ts">
import { ref } from 'vue'

const model = defineModel<string>()

withDefaults(
  defineProps<{
    id?: string
    placeholder?: string
    autocomplete?: string
    /** 校验状态（控制边框颜色），与全局 .input-error/.input-ok 对齐 */
    state?: '' | 'error' | 'ok'
  }>(),
  { id: undefined, placeholder: '', autocomplete: 'off', state: '' }
)

const emit = defineEmits<{ blur: [] }>()

const show = ref(false)
const inputEl = ref<HTMLInputElement>()

// 供父组件校验失败时聚焦（与原生 input 的 focus 行为一致）
defineExpose({
  focus: () => inputEl.value?.focus(),
})
</script>

<template>
  <div class="password-wrap">
    <input
      :id="id"
      ref="inputEl"
      v-model="model"
      class="text-input"
      :class="{ 'input-error': state === 'error', 'input-ok': state === 'ok' }"
      :type="show ? 'text' : 'password'"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      @blur="emit('blur')"
    />
    <button
      type="button"
      class="eye-btn"
      :aria-label="show ? '隐藏密码' : '显示密码'"
      tabindex="-1"
      @click="show = !show"
    >
      <!-- 隐藏态：眼睛（点击显示） -->
      <svg
        v-if="!show"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <!-- 显示态：眼睛+斜线（点击隐藏） -->
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
        />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

.password-wrap {
  position: relative;
  display: flex;
  align-items: center;

  .text-input {
    padding-right: 0.4rem; // 给眼睛按钮留位
  }
}

.eye-btn {
  position: absolute;
  right: 0.06rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.3rem;
  height: 0.3rem;
  border: none;
  background: none;
  color: $text-muted;
  cursor: pointer;

  &:hover {
    color: $primary;
  }

  svg {
    width: 0.2rem;
    height: 0.2rem;
  }
}
</style>
