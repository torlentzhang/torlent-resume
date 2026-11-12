<script setup lang="ts">
/**
 * 经典单栏·分页文档。
 *
 * 一个 <A4> 就是一张纸，页数由这里的模板显式决定（手动分页）。
 * 纸张尺寸、内边距、白底、裁切、打印分页都在 A4.vue 内，本组件不管。
 *
 * 版块标题直接写 <h2 class="section-title">，版块内的条目交给 SectionItem。
 * 本组件没有 style 块。
 *
 * 这是唯一读取 resumeData 的地方，版块组件只收 props。
 */
import { resumeData } from '@/data'
import {
  educationToItems,
  workToItems,
  projectToItems,
  portfolioToItems,
} from '@/data/toSectionItem'
import A4 from '@/components/A4.vue'
import Bullet from './blocks/Bullet.vue'
import Profile from './blocks/Profile.vue'
import SectionItem from './blocks/SectionItem.vue'

const { personalInfo, advantages, education, workExperience, projects, portfolio, languages } =
  resumeData

// 数据是构建期常量，直接转换，不需要 computed
const educationItems = educationToItems(education)
const workItems = workToItems(workExperience)
const projectItems = projectToItems(projects)
const portfolioItems = portfolioToItems(portfolio)
</script>

<template>
  <div class="flex flex-col items-center gap-12 print:gap-0">
    <!-- 第 1 页：个人信息 + 个人优势 + 工作经历 + 教育背景（含语言能力） -->
    <A4>
      <header>
        <Profile :info="personalInfo" />
      </header>

      <section v-if="advantages.length" class="section-block">
        <h2 class="section-title">个人优势</h2>
        <ul class="mt-2 space-y-1">
          <Bullet v-for="(text, index) in advantages" :key="index" :text="text" />
        </ul>
      </section>

      <section v-if="workItems.length" class="section-block">
        <h2 class="section-title">工作经历</h2>
        <SectionItem v-for="item in workItems" :key="item.title" :item="item" />
      </section>

      <section v-if="educationItems.length" class="section-block">
        <h2 class="section-title">教育背景</h2>
        <SectionItem v-for="item in educationItems" :key="item.title" :item="item" />
        <p
          v-for="(item, index) in languages"
          :key="index"
          class="mt-1 text-xs leading-relaxed text-gray-700"
        >
          <span class="font-bold text-gray-900">{{ item.name }}（{{ item.level }}）</span>
          <span v-if="item.description">：{{ item.description }}</span>
        </p>
      </section>
    </A4>

    <!-- 第 2 页：项目经历 -->
    <A4>
      <section v-if="projectItems.length">
        <h2 class="section-title">项目经历</h2>
        <SectionItem v-for="item in projectItems" :key="item.title" :item="item" />
      </section>
    </A4>

    <!-- 第 3 页：作品集 -->
    <A4>
      <section v-if="portfolioItems.length">
        <h2 class="section-title">作品集</h2>
        <SectionItem v-for="item in portfolioItems" :key="item.title" :item="item" />
      </section>
    </A4>
  </div>
</template>
