<script setup lang="ts" generic="T extends string | number">
export interface PillOption<T> {
  label: string
  value: T
}

defineProps<{
  modelValue: T
  options: PillOption<T>[]
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()
</script>

<template>
  <div class="option-group">
    <div v-if="label" class="option-label">{{ label }}</div>
    <div class="pill-group">
      <button
        v-for="opt in options"
        :key="String(opt.value)"
        type="button"
        class="pill"
        :class="{ active: opt.value === modelValue }"
        @click="emit('update:modelValue', opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

.option-group {
  margin-bottom: 0.18rem;
}

.option-label {
  font-size: 0.15rem;
  font-weight: 600;
  color: $text-sub;
  margin-bottom: 0.1rem;
}

.pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.08rem;
}

.pill {
  border: 0.02rem solid #dcdcdc;
  background: #f7f7f9;
  color: $text-sub;
  border-radius: 9.99rem;
  padding: 0.08rem 0.16rem;
  font-size: 0.15rem;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;

  &:active {
    transform: scale(0.95);
  }

  &.active {
    border-color: $primary;
    background: $primary;
    color: #fff;
    font-weight: 600;
  }
}
</style>
