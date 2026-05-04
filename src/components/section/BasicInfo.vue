<script setup lang="ts">
import { resumeData } from '../../data/resume-data'
</script>

<template>
  <div class="mb-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
      <span class="text-blue-600">—</span>
      基本信息
    </h2>
    <div class="space-y-2 text-sm">
      <div class="flex">
        <span class="text-gray-500 w-20">出生日期</span>
        <span class="text-gray-700">{{ resumeData.personalInfo.birthDate }}</span>
      </div>
      <div class="flex">
        <span class="text-gray-500 w-20">工作年限</span>
        <span class="text-gray-700">{{ resumeData.personalInfo.workYears }}</span>
      </div>
      <div class="flex">
        <span class="text-gray-500 w-20">学历</span>
        <span class="text-gray-700">{{ resumeData.personalInfo.education }}</span>
      </div>
      <div class="flex">
        <span class="text-gray-500 w-20">婚姻状况</span>
        <span class="text-gray-700">{{ resumeData.personalInfo.maritalStatus }}</span>
      </div>
      <div class="flex">
        <span class="text-gray-500 w-20">期望薪资</span>
        <span class="text-gray-700">{{ resumeData.personalInfo.expectedSalary }}</span>
      </div>
      <div class="flex">
        <span class="text-gray-500 w-20">到岗时间</span>
        <span class="text-gray-700">{{ resumeData.personalInfo.availableDate }}</span>
      </div>
    </div>
  </div>
</template>
