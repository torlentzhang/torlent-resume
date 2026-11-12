<script setup lang="ts">
/**
 * 经典单栏·分页文档。
 *
 * 一个 <A4> 就是一张纸，页数由这里的模板显式决定（手动分页）。
 * 纸张尺寸、内边距、白底、裁切、打印分页都在 A4.vue 内，本组件不管。
 *
 * 版式全部由 uno.config.ts 的 shortcuts 表达，本组件没有 style 块。
 *
 * 这是唯一读取 resumeData 的地方，版块组件只收 props。
 */
import { resumeData } from '@/data'
import A4 from '@/components/A4.vue'
import SectionTitle from './blocks/SectionTitle.vue'
import Bullet from './blocks/Bullet.vue'
import EntryHead from './blocks/EntryHead.vue'
import ProjectHead from './blocks/ProjectHead.vue'
import ProfileHeader from './blocks/ProfileHeader.vue'

const { personalInfo, advantages, workExperience, projects, openSource, education, languages } =
  resumeData
</script>

<template>
  <div class="flex flex-col items-center gap-12 print:gap-0">
    <!-- 第 1 页：个人信息 + 个人优势 + 工作经历 -->
    <A4>
      <ProfileHeader :info="personalInfo" />

      <section v-if="advantages.length" class="section-block">
        <SectionTitle text="个人优势" />
        <ul class="mt-2 space-y-1">
          <Bullet v-for="(item, index) in advantages" :key="index" :text="item" />
        </ul>
      </section>

      <section v-if="workExperience.length" class="section-block">
        <SectionTitle text="工作经历" />
        <div
          v-for="(work, index) in workExperience"
          :key="index"
          :class="['entry-block', index === 0 ? 'mt-2' : 'mt-3']"
        >
          <EntryHead
            :title="work.company"
            :subtitle="work.position"
            :period="work.period"
            :location="work.location"
          />
          <ul v-if="work.responsibilities.length || work.achievements.length" class="mt-1 space-y-1">
            <Bullet
              v-for="(item, itemIndex) in [...work.responsibilities, ...work.achievements]"
              :key="itemIndex"
              :text="item"
            />
          </ul>
        </div>
      </section>
    </A4>

    <!-- 第 2 页：项目经历 -->
    <A4>
      <section v-if="projects.length">
        <SectionTitle text="项目经历" />
        <div
          v-for="(project, index) in projects"
          :key="index"
          :class="['entry-block', index === 0 ? 'mt-2' : 'mt-3']"
        >
          <ProjectHead
            :name="project.name"
            :period="project.period"
            :tags="project.tags"
            :tech-stack="project.techStack"
          />
          <p v-if="project.description" class="bullet mt-1">{{ project.description }}</p>
          <ul
            v-if="project.responsibilities.length || project.achievements.length"
            class="mt-1 space-y-1"
          >
            <Bullet
              v-for="(item, itemIndex) in [...project.responsibilities, ...project.achievements]"
              :key="itemIndex"
              :text="item"
            />
          </ul>
        </div>
      </section>
    </A4>

    <!-- 第 3 页：开源项目 + 教育背景 + 语言能力 -->
    <A4>
      <section v-if="openSource.length">
        <SectionTitle text="开源项目" />
        <div
          v-for="(project, index) in openSource"
          :key="index"
          :class="['entry-block', index === 0 ? 'mt-2' : 'mt-3']"
        >
          <ProjectHead :name="project.name" :href="project.githubUrl" :period="project.period" />
          <p v-if="project.description" class="bullet mt-1">{{ project.description }}</p>
          <ul
            v-if="project.features.length || project.highlights.length || project.contributions.length"
            class="mt-1 space-y-1"
          >
            <Bullet
              v-for="(item, itemIndex) in [
                ...project.features,
                ...project.highlights,
                ...project.contributions,
              ]"
              :key="itemIndex"
              :text="item"
            />
          </ul>
        </div>
      </section>

      <section v-if="education.length" class="section-block">
        <SectionTitle text="教育背景" />
        <div
          v-for="(item, index) in education"
          :key="index"
          :class="['entry-block', index === 0 ? 'mt-2' : 'mt-3']"
        >
          <EntryHead
            :title="item.school"
            :subtitle="item.major"
            :period="item.period"
            :location="item.location"
          />
          <ul v-if="item.highlights.length" class="mt-1 space-y-1">
            <Bullet v-for="(text, textIndex) in item.highlights" :key="textIndex" :text="text" />
          </ul>
        </div>
      </section>

      <section v-if="languages.length" class="section-block">
        <SectionTitle text="语言能力" />
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
  </div>
</template>
