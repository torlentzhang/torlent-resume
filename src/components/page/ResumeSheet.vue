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
  <div ref="sheetRef" class="resume-page resume-grid-sheet">
    <slot />
  </div>
</template>

<style scoped>
/*
 * 尺寸、内边距、单页 grid 骨架、白底与裁切在 uno.config.ts 的 `resume-grid-sheet` shortcut 里。
 * 这里只保留两类 UnoCSS 表达不好的东西：打印期的 !important 覆盖（含 :last-child 例外）、
 * 以及开发期溢出红框（动态类切换 + @media screen 限定）。
 * 纸张尺寸是字面量：style.scss 的 :root 已废弃，唯一来源是 uno.config.ts。
 */
.resume-page.resume-overflow {
  outline: 2px solid #f53f3f;
  outline-offset: -2px;
}

/* 打印：固定纸张尺寸，一页一张，禁止被内容撑高 */
@media print {
  .resume-page {
    width: 210mm !important;
    height: 297mm !important;
    padding: 12mm 18mm !important;
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
