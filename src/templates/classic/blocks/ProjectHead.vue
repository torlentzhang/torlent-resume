<script setup lang="ts">
/**
 * 项目头：项目经历 / 开源项目共用。
 * 第一行是名称（可带链接）+ 时间；第二行是标签与技术栈，用「/」连接。
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
  <div>
    <div class="flex items-baseline justify-between gap-4">
      <component
        :is="href ? 'a' : 'span'"
        :href="href"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs font-bold text-gray-900"
      >
        {{ name }}
      </component>
      <span v-if="period" class="flex-none text-xs text-gray-500">{{ period }}</span>
    </div>
    <p v-if="tagLine" class="mt-px text-[10px] leading-[15px] text-gray-500 break-words">
      {{ tagLine }}
    </p>
  </div>
</template>
