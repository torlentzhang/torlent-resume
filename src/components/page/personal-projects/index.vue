<script setup lang="ts">
import { resumeData } from '@/data';
import ResumeSheet from '@/components/page/ResumeSheet.vue';
</script>

<template>
  <ResumeSheet>
    <h1 class="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
      <span class="text-blue-600">—</span>
      个人开源项目
    </h1>

    <div class="resume-flex-col">
      <div v-for="project in resumeData.openSource" :key="project.name" class="resume-fields open-source-item">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-base font-medium text-blue-600">
              <a :href="project.githubUrl" target="_blank" rel="noopener noreferrer" class="hover:underline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                {{ project.name }}
              </a>
            </h2>
            <p class="text-xs text-gray-500">{{ project.meta }}</p>
          </div>
          <span class="text-gray-500 text-sm">{{ project.period }}</span>
        </div>
        <p class="text-sm text-gray-600">{{ project.description }}</p>
        <div>
          <p class="text-sm font-medium text-gray-700 mb-1">主要功能：</p>
          <ul class="resume-lines">
            <li v-for="feature in project.features" :key="feature" class="text-sm text-gray-600 list-disc ml-5">
              {{ feature }}
            </li>
          </ul>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-700 mb-1">技术亮点：</p>
          <ul class="resume-lines">
            <li v-for="highlight in project.highlights" :key="highlight" class="text-sm text-gray-600 list-disc ml-5">
              {{ highlight }}
            </li>
          </ul>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-700 mb-1">个人贡献：</p>
          <ul class="resume-lines">
            <li v-for="contribution in project.contributions" :key="contribution" class="text-sm text-gray-600 list-disc ml-5">
              {{ contribution }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </ResumeSheet>
</template>

<style scoped>
/* 单列纵向流 */
.resume-flex-col {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
}

/* 条目内字段堆叠 */
.resume-fields {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
}

/* 列表行 */
.resume-lines {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 3px;
}

/* 打印分页：条目尽量不被切断 */
@media print {
  .project-item,
  .open-source-item {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>
