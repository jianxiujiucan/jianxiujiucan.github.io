<script setup lang="ts">
import { useSound } from '@/composables/useSound'

const { soundOn, toggle } = useSound()
</script>

<template>
  <button
    class="sound-toggle"
    :class="{ off: !soundOn }"
    :aria-label="soundOn ? '关闭音效' : '打开音效'"
    @click="toggle"
  ></button>
</template>

<style scoped lang="scss">
.sound-toggle {
  position: fixed;
  bottom: 0.12rem;
  right: 0.12rem;
  z-index: 10;
  width: 0.4rem;
  height: 0.4rem;
  border: none;
  border-radius: 50%;
  background: url('../assets/media/sound.png') center no-repeat rgba(255, 255, 255, 0.22);
  background-size: 60%;
  cursor: pointer;
  user-select: none;
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.9);
  }

  &.off {
    background-image: url('../assets/media/mute.png');
  }
}
</style>
