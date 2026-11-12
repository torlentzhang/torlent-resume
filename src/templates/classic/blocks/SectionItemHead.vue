<script setup lang="ts">
/**
 * 条目头部：版块内一个条目的标题行。
 *
 * 合并了原先的 EntryHead（教育/工作）与 ProjectHead（项目/作品集）：
 * 两者差异只有「第二行标签行」，在这里由 tags / techStack 是否存在决定。
 *
 * 样式全部是预设工具类，无 shortcut、无 style 块。
 */
import { computed } from 'vue'

const props = defineProps<{
  title: string
  subtitle?: string
  period?: string
  location?: string
  /** 有值时主标题渲染为链接 */
  url?: string
  tags?: string[]
  techStack?: string[]
}>()

/** 右侧元信息：时间 · 地点 */
const metaText = computed(() => [props.period, props.location].filter(Boolean).join(' · '))

/** 第二行：标签与技术栈用「/」连接 */
const tagLine = computed(() => [...(props.tags ?? []), ...(props.techStack ?? [])].join(' / '))
</script>

<template>
  <div class="flex flex-col print:break-after-avoid print:break-inside-avoid">
    <div class="flex items-baseline justify-between gap-4">
      <div class="min-w-0">
        <component
          :is="url ? 'a' : 'span'"
          :href="url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-bold text-ink no-underline"
        >
          {{ title }}
        </component>
        <span v-if="subtitle" class="ml-2 text-xs font-medium text-ink-muted">{{ subtitle }}</span>
      </div>
      <span v-if="metaText" class="flex-none text-xs text-ink-faint">{{ metaText }}</span>
    </div>
    <p v-if="tagLine" class="mt-px text-[10px] leading-[15px] text-ink-hint break-anywhere">
      {{ tagLine }}
    </p>
  </div>
</template>
