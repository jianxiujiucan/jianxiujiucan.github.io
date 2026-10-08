<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import PillGroup, { type PillOption } from '@/components/PillGroup.vue'
import { useQuizStore } from '@/stores/quiz'
import type {
  CountOption,
  OperandCount,
  OpType,
  QuizConfig,
  RangeLimit,
} from '@/types/quiz'

const router = useRouter()
const store = useQuizStore()

const countOptions: PillOption<CountOption>[] = [
  { label: '10题', value: 10 },
  { label: '20题', value: 20 },
  { label: '30题', value: 30 },
  { label: '50题', value: 50 },
  { label: '100题', value: 100 },
]

const opTypeOptions: PillOption<OpType>[] = [
  { label: '仅加法', value: 'add' },
  { label: '仅减法', value: 'sub' },
  { label: '加减混合', value: 'addsub' },
  { label: '仅乘法', value: 'mul' },
  { label: '仅除法', value: 'div' },
  { label: '乘除混合', value: 'muldiv' },
]

const rangeOptions: PillOption<RangeLimit>[] = [
  { label: '10以内', value: 10 },
  { label: '20以内', value: 20 },
  { label: '100以内', value: 100 },
]

const operandOptions: PillOption<OperandCount>[] = [
  { label: '两个数', value: 2 },
  { label: '三个数', value: 3 },
]

// 默认值与原版本一致：10题 / 仅加法 / 20以内 / 两个数
const form = reactive<{
  count: CountOption
  opType: OpType
  range: RangeLimit
  operands: OperandCount
  carry: boolean
}>({
  count: 10,
  opType: 'add',
  range: 20,
  operands: 2,
  carry: false,
})

// 进位/退位只对加减法有意义，乘除类型时隐藏该选项
const isAddSub = computed(() => ['add', 'sub', 'addsub'].includes(form.opType))

function start() {
  const config: QuizConfig = {
    count: form.count,
    opType: form.opType,
    range: form.range,
    operands: form.operands,
    carry: form.carry && isAddSub.value,
  }
  store.startQuiz(config)
  router.push('/quiz')
}
</script>

<template>
  <h1>口算答题器</h1>
  <div class="card">
    <PillGroup v-model="form.count" :options="countOptions" label="题目数量" />
    <PillGroup v-model="form.opType" :options="opTypeOptions" label="运算类型" />
    <PillGroup v-model="form.range" :options="rangeOptions" label="计算结果范围" />
    <PillGroup v-model="form.operands" :options="operandOptions" label="运算项个数" />

    <div v-show="isAddSub" class="option-group">
      <label class="checkbox-label" for="carry-checkbox">
        <input id="carry-checkbox" v-model="form.carry" type="checkbox" />
        <span>进位 / 退位练习（加大出题概率）</span>
      </label>
    </div>

    <button class="primary-btn" @click="start">开始答题</button>
  </div>
  <p class="tip">适合小学一、二年级口算练习</p>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

h1 {
  text-align: center;
  color: #fff;
  font-size: 0.28rem;
  margin: 0.28rem 0 0.18rem;
  letter-spacing: 0.02rem;
  text-shadow: 0 0.02rem 0.06rem rgba(0, 0, 0, 0.25);
}

.tip {
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.13rem;
  margin-top: 0.14rem;
}

.option-group {
  margin-bottom: 0.18rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.08rem;
  font-size: 0.15rem;
  color: $text-sub;
  cursor: pointer;
  user-select: none;

  input {
    width: 0.2rem;
    height: 0.2rem;
    accent-color: $primary;
    cursor: pointer;
  }
}
</style>
