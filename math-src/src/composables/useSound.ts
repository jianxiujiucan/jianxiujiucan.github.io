import { ref } from 'vue'
import correctUrl from '@/assets/media/correct.wav'
import errorUrl from '@/assets/media/error.wav'

type SoundName = 'correct' | 'error'

const sounds: Record<SoundName, HTMLAudioElement> = {
  correct: new Audio(correctUrl),
  error: new Audio(errorUrl),
}

// 模块级单例：开关状态全局共享；默认打开（与原行为一致）
const soundOn = ref(true)

export function useSound() {
  function play(name: SoundName) {
    if (!soundOn.value) return
    const audio = sounds[name]
    audio.currentTime = 0 // 允许连续快速播放
    void audio.play().catch(() => {}) // 忽略浏览器自动播放限制导致的失败
  }

  function toggle() {
    soundOn.value = !soundOn.value
  }

  return { soundOn, play, toggle }
}
