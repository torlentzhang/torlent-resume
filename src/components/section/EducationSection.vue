<script setup lang="ts">
import { resumeData } from '../../data'
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold text-text-primary mb-4 pb-2 border-b border-border">教育背景</h2>
    <div v-for="edu in resumeData.education" :key="edu.school" class="mb-4">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-medium text-text-primary">{{ edu.school }}</h3>
          <p class="text-primary">{{ edu.major }}</p>
        </div>
        <div class="text-right">
          <p class="text-text-secondary">{{ edu.period }}</p>
          <p class="text-text-secondary text-sm">{{ edu.location }}</p>
        </div>
      </div>
      <ul class="mt-2 space-y-1">
        <li v-for="highlight in edu.highlights" :key="highlight" class="text-sm text-text-secondary list-disc ml-5">
          {{ highlight }}
        </li>
      </ul>
    </div>
  </div>
</template>
