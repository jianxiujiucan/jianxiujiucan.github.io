import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 子路径发布：https://jianxiujiucan.github.io/math/
  base: '/math/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // 产物输出到仓库的 math/ 目录（GitHub Pages 直接服务）
    // outDir 在项目 root 之外，必须显式开启 emptyOutDir
    outDir: '../math',
    emptyOutDir: true,
  },
  test: {
    environment: 'node', // 出题逻辑是纯函数，无需 jsdom
    include: ['tests/**/*.test.ts'],
  },
})
