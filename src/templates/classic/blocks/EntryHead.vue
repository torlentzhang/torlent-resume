<script setup lang="ts">
/**
 * 条目头：工作经历 / 教育背景共用。
 * 左侧主标题 + 可选副标题，右侧「时间 · 地点」，两端对齐。
 * `entry-head` shortcut 保证打印时条目头不落在页尾。
 */
defineProps<{
  title: string
  subtitle?: string
  period?: string
  location?: string
}>()
</script>

<template>
  <div class="entry-head entry-row">
    <div class="min-w-0">
      <span class="entry-title">{{ title }}</span>
      <span v-if="subtitle" class="entry-sub">{{ subtitle }}</span>
    </div>
    <span v-if="period || location" class="entry-meta">
      {{ [period, location].filter(Boolean).join(' · ') }}
    </span>
  </div>
</template>
