<script setup lang="ts">
import { resumeData } from '../../data';
</script>

<template>
  <div class="resume-page bg-white" style="width: 210mm; min-height: 297mm; padding: 12mm 16mm;">
    <div class="flex gap-6">
      <!-- 左侧栏 -->
      <div class="w-1/3">
        <!-- 头像和个人信息 -->
        <div class="text-center mb-6">
          <div class="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-500 mb-3">
            <img
              :src="resumeData.personalInfo.avatar"
              alt="个人照片"
              class="w-full h-full object-cover"
              onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23165DFF%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2255%22 font-size=%2240%22 fill=%22white%22 text-anchor=%22middle%22%3E张%3C/text%3E%3C/svg%3E'"
            />
          </div>
          <h1 class="text-2xl font-bold text-gray-800">{{ resumeData.personalInfo.name }}</h1>
          <p class="text-blue-600 mt-1">{{ resumeData.personalInfo.title }}</p>
        </div>

        <!-- 基本信息 -->
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

        <!-- 专业技能 -->
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

        <!-- 语言能力 -->
        <div>
          <h2 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span class="text-blue-600">—</span>
            语言能力
          </h2>
          <div class="space-y-3">
            <div v-for="lang in resumeData.languages" :key="lang.name">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-medium text-gray-800">{{ lang.name }}</span>
                <span class="text-sm text-blue-600">{{ lang.level }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                <div class="bg-blue-600 h-1.5 rounded-full" :style="{ width: lang.name === '英语' ? '85%' : '55%' }"></div>
              </div>
              <p class="text-xs text-gray-500">{{ lang.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧栏 -->
      <div class="flex-1">
        <!-- 教育背景 -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span class="text-blue-600">—</span>
            教育背景
          </h2>
          <div class="space-y-4">
            <div v-for="edu in resumeData.education" :key="edu.school">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-base font-medium text-gray-800">{{ edu.school }}</h3>
                  <p class="text-blue-600 text-sm">{{ edu.major }}</p>
                </div>
                <div class="text-right">
                  <p class="text-gray-500 text-sm">{{ edu.period }}</p>
                  <p class="text-gray-500 text-xs">{{ edu.location }}</p>
                </div>
              </div>
              <ul class="mt-2 space-y-1">
                <li v-for="highlight in edu.highlights" :key="highlight" class="text-sm text-gray-600 list-disc ml-5">
                  {{ highlight }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 个人优势 -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span class="text-blue-600">—</span>
            个人优势
          </h2>
          <ul class="space-y-2">
            <li v-for="adv in resumeData.advantages" :key="adv" class="text-sm text-gray-600 list-disc ml-5">
              {{ adv }}
            </li>
          </ul>
        </div>

        <!-- 工作经历 -->
        <div>
          <h2 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span class="text-blue-600">—</span>
            工作经历
          </h2>
          <div class="space-y-5">
            <div v-for="exp in resumeData.workExperience" :key="exp.company" class="work-experience-item">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-base font-medium text-gray-800">{{ exp.company }}</h3>
                  <p class="text-blue-600 text-sm">{{ exp.position }}</p>
                </div>
                <div class="text-right">
                  <p class="text-gray-500 text-sm">{{ exp.period }}</p>
                  <p class="text-gray-500 text-xs">{{ exp.location }}</p>
                </div>
              </div>
              <div class="mt-2 space-y-2">
                <p class="text-sm font-medium text-gray-700">主要职责：</p>
                <ul class="space-y-1">
                  <li v-for="resp in exp.responsibilities" :key="resp" class="text-sm text-gray-600 list-disc ml-5">
                    {{ resp }}
                  </li>
                </ul>
                <p v-if="exp.achievements.length > 0" class="text-sm font-medium text-gray-700 mt-2">工作业绩：</p>
                <ul v-if="exp.achievements.length > 0" class="space-y-1">
                  <li v-for="achievement in exp.achievements" :key="achievement" class="text-sm text-gray-600 list-disc ml-5">
                    {{ achievement }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
