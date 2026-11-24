import { onMounted, onUnmounted, ref } from 'vue'

export function useMobile() {
  const media = window.matchMedia('(pointer: coarse)')
  const isMobile = ref(media.matches)

  function sync() {
    isMobile.value = media.matches
  }

  onMounted(() => {
    sync()
    media.addEventListener('change', sync)
  })
  onUnmounted(() => media.removeEventListener('change', sync))

  return { isMobile }
}
