export interface Language {
  name: string
  level: string
  description: string
}

export interface Education {
  school: string
  major: string
  period: string
  location: string
  highlights: string[]
}

export interface WorkExperience {
  company: string
  position: string
  period: string
  location: string
  responsibilities: string[]
  achievements: string[]
}

export interface Project {
  name: string
  period: string
  tags: string[]
  description: string
  responsibilities: string[]
  techStack: string[]
  achievements: string[]
}

/**
 * 作品集项目。
 * 开源仓库与私有项目共用一种结构：有仓库地址就填 url，私有项目留空。
 * 多端、架构分层等分组信息一律压平进 highlights，用「前缀：说明」区分。
 */
export interface PortfolioProject {
  name: string
  /** 起止时间；未上线可留空 */
  period?: string
  /** 一句话定位，如「Vue 拖拽式表单引擎」 */
  meta?: string
  /** 仓库地址；私有项目留空 */
  url?: string
  description: string
  tags: string[]
  techStack: string[]
  highlights: string[]
}

/**
 * 版块内的一个条目（教育 / 工作 / 项目 / 作品集通用）。
 * 由 src/data/toSectionItem.ts 从各自的原始结构映射而来，模板只认这一种形状。
 */
export interface SectionItem {
  /** 主标题：学校 / 公司 / 项目名 */
  title: string
  /** 副标题：专业 / 职位 */
  subtitle?: string
  /** 起止时间 */
  period?: string
  /** 地点 */
  location?: string
  /** 一段概述（项目 / 作品集用） */
  description?: string
  /** 标签（项目 / 作品集用），渲染在头部第二行 */
  tags?: string[]
  /** 技术栈（项目 / 作品集用），与 tags 合并成一行 */
  techStack?: string[]
  /** 外部链接（作品集用） */
  url?: string
  /** 所有要点，已由数据层合并完毕 */
  items: string[]
}

export interface PersonalInfo {
  name: string
  title: string
  avatar: string
  age: string
  workYears: string
  education: string
  phone: string
  email: string
  availableDate: string
}

export interface PersonalSkills {
  frontend: string[]
  frameworks: string[]
  engineering: string[]
  other: string[]
}

export interface ResumeData {
  personalInfo: PersonalInfo
  personalSkills: PersonalSkills
  languages: Language[]
  education: Education[]
  advantages: string[]
  workExperience: WorkExperience[]
  projects: Project[]
  portfolio: PortfolioProject[]
}
