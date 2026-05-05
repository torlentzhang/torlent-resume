<script setup lang="ts">
import { resumeData } from '../../data'
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold text-text-primary mb-4 pb-2 border-b border-border">语言能力</h2>
    <div class="space-y-3">
      <div v-for="lang in resumeData.languages" :key="lang.name" class="flex items-center gap-4">
        <div class="w-16 text-text-primary font-medium">{{ lang.name }}</div>
        <div class="flex-1">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm text-text-secondary">{{ lang.level }}</span>
          </div>
          <p class="text-sm text-text-secondary">{{ lang.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
