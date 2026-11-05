<script setup lang="ts">
import { computed } from 'vue'
import { resumeData } from '@/data'
import ResumeSheet from '@/components/page/ResumeSheet.vue'

const props = withDefaults(
  defineProps<{
    /** 起始项目下标（含） */
    start?: number
    /** 结束项目下标（不含） */
    end?: number
    /** 该页标题 */
    title?: string
  }>(),
  { start: 0, end: Number.MAX_SAFE_INTEGER, title: '项目经历' },
)

const visibleProjects = computed(() =>
  resumeData.projects.slice(props.start, props.end),
)
</script>

<template>
  <ResumeSheet>
    <h1 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <span class="text-blue-600">—</span>
      {{ title }}
    </h1>

    <!-- 上下两栏平分，每栏固定放一个项目 -->
    <div class="project-rows">
      <div
        v-for="project in visibleProjects"
        :key="project.name"
        class="project-item"
      >
        <div class="flex justify-between items-start">
          <h2 class="text-base font-medium text-gray-800">{{ project.name }}</h2>
          <span class="text-gray-500 text-sm shrink-0">{{ project.period }}</span>
        </div>
        <div class="flex flex-wrap gap-1.5 mt-2">
          <span v-for="tech in project.techStack" :key="tech" class="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">
            {{ tech }}
          </span>
        </div>
        <p class="text-sm text-gray-600 mt-3">{{ project.description }}</p>
        <div class="mt-3">
          <p class="text-sm font-medium text-gray-700">核心职责：</p>
          <ul class="mt-1">
            <li v-for="resp in project.responsibilities" :key="resp" class="text-sm text-gray-600 list-disc ml-5">
              {{ resp }}
            </li>
          </ul>
        </div>
        <div class="mt-3">
          <p class="text-sm font-medium text-gray-700">项目成果：</p>
          <ul class="mt-1">
            <li v-for="achievement in project.achievements" :key="achievement" class="text-sm text-gray-600 list-disc ml-5">
              {{ achievement }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </ResumeSheet>
</template>

<style scoped>
/* 上下两栏：每栏高度按内容自适应，不强制平分 */
.project-rows {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.project-item {
  /* 内容超出单页时由外层 ResumeSheet 统一告警，这里不做裁切 */
  min-height: 0;
}

/* 项目页正文行高：略松于默认，提升可读性 */
.project-item :deep(.text-sm) {
  line-height: 23px;
}

/* 打印分页：整条目不被切断 */
@media print {
  .project-item {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>
