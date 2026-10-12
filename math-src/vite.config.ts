import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // 部署路径：https://<域名>/xc/（GitHub Pages 上对应 /xc/ 子路径，同一构建两用）
  base: '/xc/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // 产物输出到仓库的 xc/ 目录（GitHub Pages 直接服务 /xc/；同时拷到 VPS 同路径）
    // outDir 在项目 root 之外，必须显式开启 emptyOutDir
    outDir: '../xc',
    emptyOutDir: true,
  },
  test: {
    environment: 'node', // 出题逻辑是纯函数，无需 jsdom
    include: ['tests/**/*.test.ts'],
  },
})
