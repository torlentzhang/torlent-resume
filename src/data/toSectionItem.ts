import type {
  Education,
  PortfolioProject,
  Project,
  SectionItem,
  WorkExperience,
} from '@/types'

/**
 * 把各版块的原始数据结构映射为模板统一使用的 SectionItem。
 *
 * 转换放在数据层而不是模板里，有两个原因：
 * 1. 「要点如何合并」属于数据语义，不该由模板决定
 * 2. 原始结构保持原样（company / school / name…），default 模板与数据文件不受影响
 */

export function educationToItems(list: Education[]): SectionItem[] {
  return list.map((edu) => ({
    title: edu.school,
    subtitle: edu.major,
    period: edu.period,
    location: edu.location,
    items: edu.highlights,
  }))
}

export function workToItems(list: WorkExperience[]): SectionItem[] {
  return list.map((work) => ({
    title: work.company,
    subtitle: work.position,
    period: work.period,
    location: work.location,
    // 职责在前、业绩在后，与前端的既有渲染顺序一致
    items: [...work.responsibilities, ...work.achievements],
  }))
}

export function projectToItems(list: Project[]): SectionItem[] {
  return list.map((project) => ({
    title: project.name,
    period: project.period,
    description: project.description,
    tags: project.tags,
    techStack: project.techStack,
    items: [...project.responsibilities, ...project.achievements],
  }))
}

export function portfolioToItems(list: PortfolioProject[]): SectionItem[] {
  return list.map((project) => ({
    title: project.name,
    period: project.period,
    description: project.description,
    tags: project.tags,
    techStack: project.techStack,
    url: project.url,
    items: project.highlights,
  }))
}
