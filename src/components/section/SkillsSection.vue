<script setup lang="ts">
import { resumeData } from '../../data';
</script>

<template>
  <div class="mb-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
      <span class="text-blue-600">—</span>
      专业技能
    </h2>
    <div class="space-y-3">
      <div>
        <h3 class="text-sm font-medium text-blue-600 mb-2">前端基础</h3>
        <div class="flex flex-wrap gap-1">
          <span v-for="skill in resumeData.skills.frontend" :key="skill" class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors">
            {{ skill }}
          </span>
        </div>
      </div>
      <div>
        <h3 class="text-sm font-medium text-blue-600 mb-2">框架与库</h3>
        <div class="flex flex-wrap gap-1">
          <span v-for="skill in resumeData.skills.frameworks" :key="skill" class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors">
            {{ skill }}
          </span>
        </div>
      </div>
      <div>
        <h3 class="text-sm font-medium text-blue-600 mb-2">工程化</h3>
        <div class="flex flex-wrap gap-1">
          <span v-for="skill in resumeData.skills.engineering" :key="skill" class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors">
            {{ skill }}
          </span>
        </div>
      </div>
      <div>
        <h3 class="text-sm font-medium text-blue-600 mb-2">其他</h3>
        <div class="flex flex-wrap gap-1">
          <span v-for="skill in resumeData.skills.other" :key="skill" class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors">
            {{ skill }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
