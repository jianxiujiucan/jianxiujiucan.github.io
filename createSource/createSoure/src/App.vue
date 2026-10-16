<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import UnitFour from "./components/UnitFour.vue";
import { exportElementToA4Image } from "./utils/a4Image";

const generating = ref(false);
const errorMsg = ref("");
const previewUrl = ref("");
const previewSize = ref("");

let lastUrl = "";

function releaseUrl() {
  if (lastUrl) {
    URL.revokeObjectURL(lastUrl);
    lastUrl = "";
  }
}

/** 严格按 .page 的边界生成一张 2 倍尺寸的图片 */
async function handleGenerate() {
  if (generating.value) return;

  const pageEl = document.querySelector<HTMLElement>(".page");
  if (!pageEl) {
    errorMsg.value = "页面上没有找到 .page 内容";
    return;
  }

  generating.value = true;
  errorMsg.value = "";

  try {
    // 等字体与布局稳定后再截图
    await document.fonts?.ready;
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const result = await exportElementToA4Image(pageEl);
    releaseUrl();
    lastUrl = result.objectUrl;
    previewUrl.value = result.objectUrl;
    previewSize.value = `${result.width} × ${result.height} px · .page 的 2 倍`;
  } catch (err) {
    errorMsg.value =
      err instanceof Error ? err.message : "生成图片失败，请重试";
  } finally {
    generating.value = false;
  }
}

function handleDownload() {
  if (!lastUrl) return;
  const title =
    document.querySelector(".page h1")?.textContent?.replace(/\s+/g, "") ||
    "page-image";

  const link = document.createElement("a");
  link.href = lastUrl;
  link.download = `${title}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function closePreview() {
  previewUrl.value = "";
  previewSize.value = "";
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") closePreview();
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  releaseUrl();
});
</script>

<template>
  <div class="exporter-bar">
    <button class="exporter-btn" :disabled="generating" @click="handleGenerate">
      <svg
        class="exporter-btn__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2.5" />
        <circle cx="8.5" cy="8.5" r="1.6" />
        <path d="M21 15.5l-4.5-4.5L7 20.5" />
      </svg>
      <span>{{ generating ? "生成中…" : "生成图片" }}</span>
    </button>
    <p v-if="errorMsg" class="exporter-error">{{ errorMsg }}</p>
  </div>

  <UnitFour />

  <div v-if="previewUrl" class="exporter-mask" @click.self="closePreview">
    <div class="exporter-modal">
      <div class="exporter-modal__head">
        <div>
          <strong>图片已生成</strong>
          <span class="exporter-modal__meta">{{ previewSize }}</span>
        </div>
        <button class="exporter-close" aria-label="关闭" @click="closePreview">
          ×
        </button>
      </div>

      <div class="exporter-preview">
        <img :src="previewUrl" alt="生成的图片预览" />
      </div>

      <div class="exporter-actions">
        <button class="exporter-btn exporter-btn--ghost" @click="closePreview">
          关闭
        </button>
        <button class="exporter-btn" @click="handleDownload">下载图片</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exporter-bar {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.exporter-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  font-family: "Microsoft YaHei", "微软雅黑", system-ui, sans-serif;
  font-size: 15px;
  line-height: 1;
  color: #fff;
  background: #2b4f9e;
  border: 1px solid #2b4f9e;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(43, 79, 158, 0.28);
  transition: transform 0.15s ease, background 0.15s ease, opacity 0.15s ease;
}

.exporter-btn:hover:not(:disabled) {
  background: #234187;
}

.exporter-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.exporter-btn:disabled {
  opacity: 0.65;
  cursor: progress;
}

.exporter-btn__icon {
  width: 18px;
  height: 18px;
}

.exporter-btn--ghost {
  color: #2b4f9e;
  background: #fff;
  box-shadow: none;
}

.exporter-btn--ghost:hover:not(:disabled) {
  background: #eef2fb;
}

.exporter-error {
  max-width: 260px;
  padding: 6px 12px;
  font-family: "Microsoft YaHei", "微软雅黑", system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: #b3261e;
  text-align: left;
  background: #fdecea;
  border-radius: 8px;
}

.exporter-mask {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.45);
}

.exporter-modal {
  display: flex;
  flex-direction: column;
  width: min(720px, 100%);
  max-height: 90vh;
  padding: 18px 20px 20px;
  font-family: "Microsoft YaHei", "微软雅黑", system-ui, sans-serif;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
}

.exporter-modal__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  color: #222;
  font-size: 16px;
}

.exporter-modal__meta {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  color: #888;
}

.exporter-close {
  padding: 0 6px;
  font-size: 24px;
  line-height: 1;
  color: #888;
  background: none;
  border: 0;
  cursor: pointer;
}

.exporter-close:hover {
  color: #222;
}

.exporter-preview {
  flex: 1;
  min-height: 0;
  margin: 14px 0 16px;
  overflow: auto;
  background: #f2f2ee;
  border-radius: 8px;
}

.exporter-preview img {
  display: block;
  width: 100%;
  height: auto;
}

.exporter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
