import { defineComponent, h } from 'vue'
import PersonalInfoPage from '@/components/page/personal-info/index.vue'
import ProjectExperiencePage from '@/components/page/project-experience/index.vue'
import type { ResumeTemplate } from '@/types'

// 现有项目页靠 props 切片复用，这里用轻量包装组件固定每页的区间。
const ProjectsPageOne = defineComponent({
  name: 'DefaultProjectsPageOne',
  render: () => h(ProjectExperiencePage, { start: 0, end: 2 }),
})

const ProjectsPageTwo = defineComponent({
  name: 'DefaultProjectsPageTwo',
  render: () => h(ProjectExperiencePage, { start: 2, end: 3, title: '项目经历（续）' }),
})

const defaultTemplate: ResumeTemplate = {
  id: 'default',
  name: '默认版式',
  description: '现有三页版式：个人信息、项目经历、项目经历（续）',
  pages: [PersonalInfoPage, ProjectsPageOne, ProjectsPageTwo],
}

export default defaultTemplate
