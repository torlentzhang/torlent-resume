<script setup lang="ts">
import { computed, ref } from 'vue'
import { DEFAULT_TEMPLATE_ID, getResumeTemplate, resumeTemplates } from '@/templates/registry'
import type { ResumeTemplate } from '@/types'

const activeTemplateId = ref(DEFAULT_TEMPLATE_ID)
const activeTemplate = computed<ResumeTemplate>(() => getResumeTemplate(activeTemplateId.value))

const isExporting = ref(false)

function exportToPdf() {
  isExporting.value = true
  window.print()
  setTimeout(() => {
    isExporting.value = false
  }, 1000)
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center py-12 px-8">
    <div class="no-print mb-8 flex items-center gap-3">
      <select
        v-model="activeTemplateId"
        class="px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:border-blue-600 focus:outline-none"
      >
        <option v-for="template in resumeTemplates" :key="template.id" :value="template.id">
          {{ template.name }}
        </option>
      </select>
      <button
        @click="exportToPdf"
        :disabled="isExporting"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {{ isExporting ? '导出中...' : '导出 PDF' }}
      </button>
    </div>

    <div class="resume-list px-4">
      <component :is="activeTemplate.flow" v-if="activeTemplate.flow" />
      <template v-else>
        <component
          :is="page"
          v-for="(page, index) in activeTemplate.pages ?? []"
          :key="`${activeTemplate.id}-${index}`"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
/* 屏幕上的页面堆叠间距；打印时归零，避免插入空白页 */
.resume-list {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

@media print {
  /*
   * 打印态必须退出 flex：flex 容器跨页在 Chrome 里会产生空白页。
   * classic 是单条连续流，靠浏览器原生分页，容器只需交还文档流。
   */
  .resume-list {
    display: block;
    gap: 0;
    padding: 0;
  }

  .min-h-screen {
    min-height: auto;
    padding: 0;
  }

  .no-print {
    display: none;
  }
}
</style>
