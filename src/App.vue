<script setup lang="ts">
import { ref } from 'vue'
import ResumePage1 from './components/page/ResumePage1.vue'
import ResumePage2 from './components/page/ResumePage2.vue'
import ResumePage3 from './components/page/ResumePage3.vue'

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

    <div class="space-y-12 px-4">
      <ResumePage1 />
      <ResumePage2 />
      <ResumePage3 />
    </div>
  </div>
</template>
