<script setup lang="ts">
/**
 * 一张 A4 纸。
 *
 * 样式全部来自 uno.config.ts 的 `a4-sheet`：尺寸 210×297mm、内边距 12mm 18mm、
 * 白底、裁切，以及打印时「非末页强制分页」。组件内没有 style 块。
 *
 * 内容超出会被裁掉——这是内容本身的问题，不由容器监测。
 */
withDefaults(
  defineProps<{
    /** 关闭内边距，用于整版出血的设计 */
    padding?: boolean
  }>(),
  { padding: true },
)
</script>

<template>
  <div class="a4-sheet" :class="{ 'p-0': !padding }">
    <slot />
  </div>
</template>
