<script setup lang="ts">
import { resumeData } from '../../data'
</script>

<template>
  <div class="space-y-6">
    <div v-for="project in resumeData.openSource" :key="project.name">
      <div class="flex justify-between items-start mb-2">
        <div>
          <h3 class="text-lg font-medium text-primary">
            <a :href="project.githubUrl" target="_blank" rel="noopener">{{ project.name }}</a>
          </h3>
          <span class="text-text-secondary text-sm">{{ project.period }}</span>
        </div>
        <span class="text-text-secondary text-sm">{{ project.meta }}</span>
      </div>
      <p class="text-text-secondary text-sm mb-3">{{ project.description }}</p>
      <p class="text-sm font-medium text-text-primary mb-1">主要功能：</p>
      <ul class="space-y-1 mb-3">
        <li v-for="feature in project.features" :key="feature" class="text-sm text-text-secondary list-disc ml-5">
          {{ feature }}
        </li>
      </ul>
      <p class="text-sm font-medium text-text-primary mb-1">技术亮点：</p>
      <ul class="space-y-1 mb-3">
        <li v-for="highlight in project.highlights" :key="highlight" class="text-sm text-text-secondary list-disc ml-5">
          {{ highlight }}
        </li>
      </ul>
      <p class="text-sm font-medium text-text-primary mb-1">个人贡献：</p>
      <ul class="space-y-1">
        <li v-for="contribution in project.contributions" :key="contribution" class="text-sm text-text-secondary list-disc ml-5">
          {{ contribution }}
        </li>
      </ul>
    </div>
  </div>
</template>
