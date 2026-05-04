<script setup lang="ts">
import { resumeData } from '../../data/resume-data'
</script>

<template>
  <div class="flex items-center gap-6">
    <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-primary">
      <img
        :src="resumeData.personalInfo.avatar"
        alt="avatar"
        class="w-full h-full object-cover"
        onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23165DFF%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 font-size=%2240%22 fill=%22white%22 text-anchor=%22middle%22>张</text></svg>'"
      />
    </div>
    <div>
      <h1 class="text-3xl font-bold text-text-primary">{{ resumeData.personalInfo.name }}</h1>
      <p class="text-lg text-primary mt-1">{{ resumeData.personalInfo.title }}</p>
    </div>
  </div>
</template>
