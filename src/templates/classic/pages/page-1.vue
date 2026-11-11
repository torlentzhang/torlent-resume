<script setup lang="ts">
import A4 from '@/components/A4.vue'
import { resumeData } from '@/data'

const { personalInfo, advantages, workExperience, education, personalSkills, languages } = resumeData

const contactLine = [
  personalInfo.phone,
  personalInfo.email,
  personalInfo.age,
  personalInfo.workYears,
  personalInfo.education,
  personalInfo.availableDate,
]
  .filter((value) => value.length > 0)
  .join(' · ')

const workList = workExperience.map((work) => ({
  ...work,
  items: [...work.responsibilities, ...work.achievements],
}))

const skillGroups = [
  { label: '前端', items: personalSkills.frontend },
  { label: '框架', items: personalSkills.frameworks },
  { label: '工程化', items: personalSkills.engineering },
  { label: '其他', items: personalSkills.other },
].filter((group) => group.items.length > 0)
</script>

<template>
  <A4>
    <div class="classic-page">
      <header class="flex items-start gap-5 border-b border-gray-900 pb-4">
        <img
          v-if="personalInfo.avatar"
          class="h-16 w-16 flex-none rounded-full border border-gray-300 object-cover grayscale"
          :src="personalInfo.avatar"
          :alt="`${personalInfo.name}的头像`"
        />
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl font-bold leading-tight text-gray-900">
            {{ personalInfo.name }}
          </h1>
          <p class="mt-1 text-sm text-gray-600">{{ personalInfo.title }}</p>
          <p class="mt-2 text-xs leading-relaxed text-gray-600">{{ contactLine }}</p>
        </div>
      </header>

      <section v-if="advantages.length" class="mt-4">
        <h2 class="section-title">个人优势</h2>
        <ul class="mt-2 space-y-1">
          <li v-for="(item, index) in advantages" :key="index" class="bullet">{{ item }}</li>
        </ul>
      </section>

      <section v-if="workList.length" class="mt-4">
        <h2 class="section-title">工作经历</h2>
        <div v-for="(work, index) in workList" :key="index" class="mt-2">
          <div class="flex items-baseline justify-between gap-4">
            <div class="min-w-0">
              <span class="text-xs font-bold text-gray-900">{{ work.company }}</span>
              <span class="ml-2 text-xs text-gray-600">{{ work.position }}</span>
            </div>
            <span class="flex-none text-xs text-gray-500">
              {{ work.period }} · {{ work.location }}
            </span>
          </div>
          <ul class="mt-1 space-y-1">
            <li v-for="(item, itemIndex) in work.items" :key="itemIndex" class="bullet">
              {{ item }}
            </li>
          </ul>
        </div>
      </section>

      <section v-if="education.length" class="mt-4">
        <h2 class="section-title">教育背景</h2>
        <div v-for="(item, index) in education" :key="index" class="mt-2">
          <div class="flex items-baseline justify-between gap-4">
            <div class="min-w-0">
              <span class="text-xs font-bold text-gray-900">{{ item.school }}</span>
              <span class="ml-2 text-xs text-gray-600">{{ item.major }}</span>
            </div>
            <span class="flex-none text-xs text-gray-500">
              {{ item.period }} · {{ item.location }}
            </span>
          </div>
          <ul v-if="item.highlights.length" class="mt-1 space-y-1">
            <li v-for="(text, textIndex) in item.highlights" :key="textIndex" class="bullet">
              {{ text }}
            </li>
          </ul>
        </div>
      </section>

      <section v-if="skillGroups.length" class="mt-4">
        <h2 class="section-title">专业技能</h2>
        <p v-for="group in skillGroups" :key="group.label" class="mt-1 text-xs leading-relaxed">
          <span class="font-bold text-gray-900">{{ group.label }}：</span>
          <span class="text-gray-700">{{ group.items.join('、') }}</span>
        </p>
      </section>

      <section v-if="languages.length" class="mt-4">
        <h2 class="section-title">语言能力</h2>
        <p
          v-for="(item, index) in languages"
          :key="index"
          class="mt-1 text-xs leading-relaxed text-gray-700"
        >
          <span class="font-bold text-gray-900">{{ item.name }}（{{ item.level }}）</span>
          <span v-if="item.description">：{{ item.description }}</span>
        </p>
      </section>
    </div>
  </A4>
</template>

<style scoped>
.section-title {
  padding-bottom: 4px;
  border-bottom: 1px solid #d4d4d4;
  font-size: 13px;
  line-height: 18px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #111;
}

.bullet {
  position: relative;
  padding-left: 12px;
  font-size: 12px;
  line-height: 1.7;
  color: #333;
}

.bullet::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.68em;
  width: 3px;
  height: 3px;
  background: #111;
}
</style>
