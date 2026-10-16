# 项目长期笔记

## 项目概况
- 小学语文「整理与复习」练习卷生成页面（Vue 3 + Vite + TS），核心内容在 `src/components/LearnContent.vue` 的 `.page`（固定 1201px 高，内容会溢出约 77px）。
- 包管理用 pnpm。

## 关键经验
- **DOM 转图片**：用 html-to-image（`src/utils/a4Image.ts` + 纯函数 `src/utils/a4Layout.ts`）。克隆节点会内联"已用样式"，根节点必须显式 `style: { boxSizing: 'border-box', maxWidth: 'none', margin: '0' }` 抵消，否则 auto 居中边距/max-width 会把内容推移、裁切；捕获高度用 `Math.max(offsetHeight, scrollHeight)` 以包含溢出内容。
- **浏览器验证**：本环境 GUI 进程无法常驻，headless 浏览器验证要在同一条 bash 命令里完成"启动 Edge headless（--remote-debugging-port）→ Node CDP 脚本 → kill"全流程。
