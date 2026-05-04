<script setup lang="ts">
import { resumeData } from '../../data/resume-data'
</script>

<template>
  <div class="space-y-6">
    <div v-for="project in resumeData.projects" :key="project.name">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-medium text-text-primary">{{ project.name }}</h3>
        <span class="text-text-secondary text-sm">{{ project.period }}</span>
      </div>
      <div class="flex flex-wrap gap-2 mb-3">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="px-2 py-1 bg-primary text-white text-xs rounded"
        >
          {{ tag }}
        </span>
      </div>
      <p class="text-text-secondary text-sm mb-3">{{ project.description }}</p>
      <p class="text-sm font-medium text-text-primary mb-1">主要职责：</p>
      <ul class="space-y-1 mb-3">
        <li v-for="resp in project.responsibilities" :key="resp" class="text-sm text-text-secondary list-disc ml-5">
          {{ resp }}
        </li>
      </ul>
      <p class="text-sm font-medium text-text-primary mb-1">技术栈：</p>
      <div class="flex flex-wrap gap-2 mb-3">
        <span
          v-for="tech in project.techStack"
          :key="tech"
          class="px-2 py-1 bg-tag-bg text-text-primary text-xs rounded"
        >
          {{ tech }}
        </span>
      </div>
      <p class="text-sm font-medium text-text-primary mb-1">主要成果：</p>
      <ul class="space-y-1">
        <li v-for="achievement in project.achievements" :key="achievement" class="text-sm text-text-secondary list-disc ml-5">
          {{ achievement }}
        </li>
      </ul>
    </div>
  </div>
</template>
