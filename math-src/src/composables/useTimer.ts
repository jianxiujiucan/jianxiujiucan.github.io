import { computed, onUnmounted, ref } from 'vue'

export function useTimer() {
  const seconds = ref(0)
  let timerId: ReturnType<typeof setInterval> | null = null

  const display = computed(() => {
    const m = String(Math.floor(seconds.value / 60)).padStart(2, '0')
    const s = String(seconds.value % 60).padStart(2, '0')
    return `${m}:${s}`
  })

  function start() {
    stop()
    seconds.value = 0
    timerId = setInterval(() => seconds.value++, 1000)
  }

  function stop() {
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
    }
  }

  // 离开答题页（组件卸载）时自动停止
  onUnmounted(stop)

  return { seconds, display, start, stop }
}
