<script setup lang="ts">
import { ref } from 'vue'
import PersonalInfoPage from './components/page/personal-info/index.vue'
import ProjectExperiencePage from './components/page/project-experience/index.vue'

// 个人项目页：内容补齐后取消下一行导入与模板中的注释
// import PersonalProjectsPage from './components/page/personal-projects/index.vue'

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
    <div class="no-print mb-8">
      <button
        @click="exportToPdf"
        :disabled="isExporting"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {{ isExporting ? '导出中...' : '导出 PDF' }}
      </button>
    </div>

    <div class="resume-list px-4">
      <PersonalInfoPage />
      <ProjectExperiencePage :start="0" :end="2" />
      <ProjectExperiencePage :start="2" :end="3" title="项目经历（续）" />
      <!-- 个人项目页：内容补齐后取消注释 -->
      <!-- <PersonalProjectsPage /> -->
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
  .resume-list {
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
