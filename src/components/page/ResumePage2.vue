<script setup lang="ts">
import { resumeData } from '../../data';
</script>

<template>
  <div class="resume-page bg-white" style="width: 210mm; min-height: 297mm; padding: 12mm 16mm;">
    <h1 class="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
      <span class="text-blue-600">—</span>
      项目经历
    </h1>

    <div class="space-y-6">
      <div v-for="project in resumeData.projects" :key="project.name" class="pb-5 border-b border-gray-200 last:border-0 project-item">
        <div class="flex justify-between items-start mb-2">
          <h2 class="text-base font-medium text-gray-800">{{ project.name }}</h2>
          <span class="text-gray-500 text-sm">{{ project.period }}</span>
        </div>
        <div class="flex flex-wrap gap-2 mb-3">
          <span v-for="tag in project.tags" :key="tag" class="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded hover:bg-blue-200 transition-colors">
            {{ tag }}
          </span>
        </div>
        <p class="text-sm text-gray-600 mb-3">{{ project.description }}</p>
        <p class="text-sm font-medium text-gray-700 mb-1">核心职责：</p>
        <ul class="space-y-1 mb-3">
          <li v-for="resp in project.responsibilities" :key="resp" class="text-sm text-gray-600 list-disc ml-5">
            {{ resp }}
          </li>
        </ul>
        <p class="text-sm font-medium text-gray-700 mb-1">技术栈：</p>
        <div class="flex flex-wrap gap-1 mb-3">
          <span v-for="tech in project.techStack" :key="tech" class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors">
            {{ tech }}
          </span>
        </div>
        <p class="text-sm font-medium text-gray-700 mb-1">项目成果：</p>
        <ul class="space-y-1">
          <li v-for="achievement in project.achievements" :key="achievement" class="text-sm text-gray-600 list-disc ml-5">
            {{ achievement }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
