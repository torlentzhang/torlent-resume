<script setup lang="ts">
/**
 * 项目头：项目经历 / 开源项目共用。
 * 第一行是名称（可带链接）+ 时间；第二行是标签与技术栈，用「/」连接。
 * `entry-head` shortcut 保证打印时项目头不与下方 bullet 分离。
 */
const props = defineProps<{
  name: string
  href?: string
  period?: string
  tags?: string[]
  techStack?: string[]
}>()

const tagLine = [...(props.tags ?? []), ...(props.techStack ?? [])].join(' / ')
</script>

<template>
  <div class="entry-head">
    <div class="entry-row">
      <component
        :is="href ? 'a' : 'span'"
        :href="href"
        target="_blank"
        rel="noopener noreferrer"
        class="entry-title no-underline"
      >
        {{ name }}
      </component>
      <span v-if="period" class="entry-meta">{{ period }}</span>
    </div>
    <p v-if="tagLine" class="project-tags">
      {{ tagLine }}
    </p>
  </div>
</template>
