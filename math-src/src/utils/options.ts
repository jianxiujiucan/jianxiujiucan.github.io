import type { PillOption } from '@/components/PillGroup.vue'
import type { OpType } from '@/types/quiz'

/** 运算类型选项（设置页与排行榜共用） */
export const opTypeOptions: PillOption<OpType>[] = [
  { label: '仅加法', value: 'add' },
  { label: '仅减法', value: 'sub' },
  { label: '加减混合', value: 'addsub' },
  { label: '仅乘法', value: 'mul' },
  { label: '仅除法', value: 'div' },
  { label: '乘除混合', value: 'muldiv' },
]
