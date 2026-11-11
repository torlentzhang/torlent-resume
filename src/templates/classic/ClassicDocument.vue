<script setup lang="ts">
/**
 * 经典单栏·流式文档。
 *
 * 分页完全交给浏览器原生分页：
 * - 屏幕：一条连续窄栏，宽度与纸张内容区一致（210mm 减左右 16mm）。
 * - 打印：页面边距由具名页面 `@page classic` 提供，容器自身 padding 归零，
 *   否则边距会翻倍。断页规则见下方 <style>。
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
  <div class="classic-doc">
    <ProfileHeader :info="personalInfo" />

    <section v-if="advantages.length" class="classic-section">
      <SectionTitle text="个人优势" />
      <ul class="mt-2 space-y-1">
        <Bullet v-for="(item, index) in advantages" :key="index" :text="item" />
      </ul>
    </section>

    <section v-if="workExperience.length" class="classic-section">
      <SectionTitle text="工作经历" />
      <div
        v-for="(work, index) in workExperience"
        :key="index"
        :class="['classic-entry', index === 0 ? 'mt-2' : 'mt-3']"
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

    <section v-if="projects.length" class="classic-section">
      <SectionTitle text="项目经历" />
      <div
        v-for="(project, index) in projects"
        :key="index"
        :class="['classic-entry', index === 0 ? 'mt-2' : 'mt-3']"
      >
        <ProjectHead
          :name="project.name"
          :period="project.period"
          :tags="project.tags"
          :tech-stack="project.techStack"
        />
        <p v-if="project.description" class="classic-bullet mt-1">{{ project.description }}</p>
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

    <section v-if="openSource.length" class="classic-section">
      <SectionTitle text="开源项目" />
      <div
        v-for="(project, index) in openSource"
        :key="index"
        :class="['classic-entry', index === 0 ? 'mt-2' : 'mt-3']"
      >
        <ProjectHead :name="project.name" :href="project.githubUrl" :period="project.period" />
        <p v-if="project.description" class="classic-bullet mt-1">{{ project.description }}</p>
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

    <section v-if="education.length" class="classic-section">
      <SectionTitle text="教育背景" />
      <div
        v-for="(item, index) in education"
        :key="index"
        :class="['classic-entry', index === 0 ? 'mt-2' : 'mt-3']"
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

    <section v-if="languages.length" class="classic-section">
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

<style scoped>
/*
 * 屏幕态：复刻纸张内容区。
 * 210mm 减左右各 16mm 内边距 = 178mm 内容宽，与打印时的内容区完全一致。
 * 高度自适应，内容不会被裁切，滚动即可看全。
 */
.classic-doc {
  width: 210mm;
  padding: 12mm 16mm;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);

  /* 绑定到下方具名页面；default 模板的全局 @page 不受影响 */
  page: classic;
}

/* 版块之间的间距，用 margin 而非 gap：跨页容器保持 block 布局最稳 */
.classic-section {
  margin-top: 22px;
}

.classic-bullet {
  position: relative;
  padding-left: 12px;
  font-size: 12px;
  line-height: 21.6px;
  color: #333;
}

.classic-bullet::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.72em;
  width: 3px;
  height: 3px;
  background: #111;
}

.classic-section-title {
  padding-bottom: 5px;
  border-bottom: 1px solid #d4d4d4;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.14em;
}

/* ---------- 打印 ---------- */

@page classic {
  size: A4;
  /* 必须与 :root 的 --a4-padding 同步（见 style.scss 注释） */
  margin: 12mm 16mm;
}

@media print {
  /* 页面边距已由 @page 提供，容器自身边距必须归零，否则边距翻倍 */
  .classic-doc {
    width: auto;
    padding: 0;
    box-shadow: none;
  }

  .classic-section {
    margin-top: 16px;
  }

  /* 标题不得落在页尾，必须跟住正文 */
  .classic-section-title {
    break-after: avoid;
    break-inside: avoid;
  }

  /*
   * 条目允许在 bullet 之间断开：一个项目/经历常占半页以上，
   * 整条不可分割会把大段内容推到下一页，造成成片空白。
   * 条目头仍然 keep-with-next，保证跨页后页面顶部的第一条 bullet 不孤悬。
   */
  .classic-entry {
    break-inside: auto;
  }

  .classic-entry-head {
    break-after: avoid;
    break-inside: avoid;
  }

  /* 单条 bullet 不跨页 */
  .classic-bullet {
    break-inside: avoid;
  }

  p,
  li {
    orphans: 2;
    widows: 2;
  }
}
</style>
