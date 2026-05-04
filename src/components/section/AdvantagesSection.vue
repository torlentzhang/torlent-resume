<script setup lang="ts">
import { resumeData } from '../../data/resume-data'
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold text-text-primary mb-4 pb-2 border-b border-border">个人优势</h2>
    <ul class="space-y-2">
      <li v-for="adv in resumeData.advantages" :key="adv" class="text-text-secondary list-disc ml-5">
        {{ adv }}
      </li>
    </ul>
  </div>
</template>
