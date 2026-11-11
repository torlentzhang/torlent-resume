<script setup lang="ts">
/**
 * 条目头：工作经历 / 教育背景共用。
 * 左侧主标题 + 可选副标题，右侧「时间 · 地点」，两端对齐。
 */
defineProps<{
  title: string
  subtitle?: string
  period?: string
  location?: string
}>()
</script>

<template>
  <div class="classic-entry-head flex items-baseline justify-between gap-4">
    <div class="min-w-0">
      <span class="text-xs font-bold text-gray-900">{{ title }}</span>
      <span v-if="subtitle" class="ml-2 text-xs font-medium text-gray-600">{{ subtitle }}</span>
    </div>
    <span v-if="period || location" class="flex-none text-xs text-gray-500">
      {{ [period, location].filter(Boolean).join(' · ') }}
    </span>
  </div>
</template>
