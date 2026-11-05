<script setup lang="ts">
/**
 * 严格单页容器：尺寸由 :root 的 --resume-page-* 变量统一控制。
 * 打印时「一个 ResumeSheet = 一张纸」，页数恒等于组件数量。
 *
 * 内容超出单页时会被裁切，因此这里持续监测并在开发期显式告警：
 * 屏幕预览会给容器加红框（.resume-overflow），打印时该样式不生效。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const sheetRef = ref<HTMLElement | null>(null)
let observer: ResizeObserver | null = null

function checkOverflow() {
  const el = sheetRef.value
  if (!el) return
  const overflow = el.scrollHeight - el.clientHeight
  if (overflow > 1) {
    el.classList.add('resume-overflow')
    console.warn(
      `[ResumeSheet] 内容超出单页 ${overflow}px，超出部分会被裁切，请精简内容或拆页。`,
    )
  } else {
    el.classList.remove('resume-overflow')
  }
}

onMounted(async () => {
  // 等字体就绪再测，避免回退字体切换导致的误报
  await document.fonts.ready
  checkOverflow()
  if (sheetRef.value) {
    observer = new ResizeObserver(checkOverflow)
    observer.observe(sheetRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div ref="sheetRef" class="resume-page bg-white overflow-hidden">
    <slot />
  </div>
</template>

<style scoped>
/* 单页固定尺寸：允许内容被裁切，页数恒等于组件数量 */
.resume-page {
  width: var(--resume-page-width);
  height: var(--resume-page-height);
  padding: var(--resume-page-padding);
  box-sizing: border-box;

  /* 单页骨架：标题行自动高度，正文占满剩余行 */
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  align-content: start;
  gap: 0;
}

/*
 * 字号统一以 px 定义，不随浏览器默认字号缩放，保证版面高度可预测。
 * 用 :deep() 是因为内容来自 <slot>，scoped 选择器默认不会作用到 slotted 内容。
 */
.resume-page :deep(.text-3xl)  { font-size: 32px; line-height: 40px; }
.resume-page :deep(.text-2xl)  { font-size: 26px; line-height: 34px; }
.resume-page :deep(.text-xl)   { font-size: 22px; line-height: 30px; }
.resume-page :deep(.text-lg)   { font-size: 20px; line-height: 28px; }
.resume-page :deep(.text-base) { font-size: 18px; line-height: 26px; }
.resume-page :deep(.text-sm)   { font-size: 16px; line-height: 23px; }
.resume-page :deep(.text-xs)   { font-size: 13px; line-height: 18px; }

/* 溢出提示：仅屏幕预览可见，不影响打印产出 */
@media screen {
  .resume-page.resume-overflow {
    outline: 2px solid #f53f3f;
    outline-offset: -2px;
  }
}

/* 打印：固定纸张尺寸，一页一张，禁止被内容撑高 */
@media print {
  .resume-page {
    width: var(--resume-page-width) !important;
    height: var(--resume-page-height) !important;
    padding: var(--resume-page-padding) !important;
    box-sizing: border-box !important;
    min-height: 0 !important;
    overflow: hidden !important;
    page-break-after: always !important;
    page-break-inside: avoid !important;
    break-after: page !important;
    break-inside: avoid !important;
    box-shadow: none !important;
    margin: 0 !important;
  }

  .resume-page:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }
}
</style>
