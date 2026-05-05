<script setup lang="ts">
import { resumeData } from '../../data';
</script>

<template>
  <div class="resume-page bg-white" style="width: 210mm; min-height: 297mm; padding: 12mm 16mm;">
    <h1 class="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
      <span class="text-blue-600">—</span>
      个人开源项目
    </h1>

    <div class="space-y-6">
      <div v-for="project in resumeData.openSource" :key="project.name" class="pb-5 border-b border-gray-200 last:border-0 open-source-item">
        <div class="flex justify-between items-start mb-2">
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
        <p class="text-sm text-gray-600 mb-3">{{ project.description }}</p>
        <p class="text-sm font-medium text-gray-700 mb-1">主要功能：</p>
        <ul class="space-y-1 mb-3">
          <li v-for="feature in project.features" :key="feature" class="text-sm text-gray-600 list-disc ml-5">
            {{ feature }}
          </li>
        </ul>
        <p class="text-sm font-medium text-gray-700 mb-1">技术亮点：</p>
        <ul class="space-y-1 mb-3">
          <li v-for="highlight in project.highlights" :key="highlight" class="text-sm text-gray-600 list-disc ml-5">
            {{ highlight }}
          </li>
        </ul>
        <p class="text-sm font-medium text-gray-700 mb-1">个人贡献：</p>
        <ul class="space-y-1">
          <li v-for="contribution in project.contributions" :key="contribution" class="text-sm text-gray-600 list-disc ml-5">
            {{ contribution }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
