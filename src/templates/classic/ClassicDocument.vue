<script setup lang="ts">
/**
 * 经典单栏·流式文档。
 *
 * 分页完全交给浏览器原生分页：
 * - 屏幕：一条连续窄栏，宽度与纸张内容区一致（210mm 减左右 16mm）。
 * - 打印：页面边距由具名页面 `@page classic` 提供，容器自身 padding 归零，
 *   否则边距会翻倍。
 *
 * 版式全部由 uno.config.ts 的 shortcuts 表达（doc-sheet / section-block /
 * bullet / section-title / entry-* 等），下方 style 块只保留 @page 这个 at-rule。
 *
 * 这是唯一读取 resumeData 的地方，版块组件只收 props。
 */
import { resumeData } from '@/data'
import SectionTitle from './blocks/SectionTitle.vue'
import Bullet from './blocks/Bullet.vue'
import EntryHead from './blocks/EntryHead.vue'
import ProjectHead from './blocks/ProjectHead.vue'
import ProfileHeader from './blocks/ProfileHeader.vue'

const { personalInfo, advantages, workExperience, projects, openSource, education, languages } =
  resumeData
</script>

<template>
  <div class="doc-sheet">
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

    <section v-if="projects.length" class="section-block">
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

    <section v-if="openSource.length" class="section-block">
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
  </div>
</template>

<style>
/*
 * 这里只放 UnoCSS 无法表达的东西：`@page` 是 at-rule，不是选择器，工具类覆盖不到。
 *
 * 用具名页面（@page classic + 容器上的 page:classic）而不是改全局 @page，
 * 是因为 default 模板的 ResumeSheet 自带 297mm 固定高度和自带 padding，
 * 必须保持全局 `@page { margin: 0 }` 不变。两种分页语义靠具名页面并存。
 *
 * 其余版式（纸张、版块间距、bullet 符号、断页规则）全部在 uno.config.ts 里，
 * 见 doc-sheet / section-block / bullet / section-title / entry-head 等 shortcut。
 */
@page classic {
  size: A4;
  /* 必须与 src/style/style.scss 的 :root --a4-padding 同步 */
  margin: 12mm 16mm;
}
</style>
