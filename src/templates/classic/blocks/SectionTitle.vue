<script setup lang="ts">
/**
 * 版块标题：单个 h2 + 下边框。
 * 样式全部来自 uno 的 `section-title` shortcut（含打印期的 break-after: avoid）。
 */
defineProps<{
  text: string
}>()
</script>

<template>
  <h2 class="section-title">
    {{ text }}
  </h2>
</template>
