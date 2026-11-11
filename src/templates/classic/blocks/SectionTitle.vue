<script setup lang="ts">
/**
 * 版块标题：单个 h2 + 下边框。
 * 打印时靠 .classic-section-title 的 break-after: avoid 保证不落在页尾。
 */
defineProps<{
  text: string
}>()
</script>

<template>
  <h2 class="classic-section-title text-xs font-bold tracking-wider text-gray-900">
    {{ text }}
  </h2>
</template>
