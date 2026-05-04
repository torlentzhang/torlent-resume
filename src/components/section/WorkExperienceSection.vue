<script setup lang="ts">
import { resumeData } from '../../data/resume-data'
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold text-text-primary mb-4 pb-2 border-b border-border">工作经历</h2>
    <div v-for="exp in resumeData.workExperience" :key="exp.company" class="mb-6">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-medium text-text-primary">{{ exp.company }}</h3>
          <p class="text-primary">{{ exp.position }}</p>
        </div>
        <div class="text-right">
          <p class="text-text-secondary">{{ exp.period }}</p>
          <p class="text-text-secondary text-sm">{{ exp.location }}</p>
        </div>
      </div>
      <div class="mt-3 space-y-2">
        <p class="text-sm font-medium text-text-primary">主要职责：</p>
        <ul class="space-y-1">
          <li v-for="resp in exp.responsibilities" :key="resp" class="text-sm text-text-secondary list-disc ml-5">
            {{ resp }}
          </li>
        </ul>
        <p class="text-sm font-medium text-text-primary mt-3">主要成就：</p>
        <ul class="space-y-1">
          <li v-for="achievement in exp.achievements" :key="achievement" class="text-sm text-text-secondary list-disc ml-5">
            {{ achievement }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
