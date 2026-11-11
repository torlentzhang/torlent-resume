/*
 * 真实简历数据入口（本文件纳入版本控制，其余数据文件被 .gitignore 忽略）。
 *
 * 为什么用 import.meta.glob 而不是静态 import：
 * 真实数据文件只存在于作者本地。若静态 import，他人克隆仓库后因文件缺失会直接构建失败。
 * glob 是「有则加载、无则跳过」，因此在没有真实数据时本模块各项为 undefined，
 * 由 src/data/index.ts 回退到演示数据。
 */
import type {
  Education,
  Language,
  OpenSourceProject,
  PersonalInfo,
  PersonalSkills,
  Project,
  WorkExperience,
} from '@/types'

type Modules = Record<string, Record<string, unknown>>

// personal-projects.ts 是尚未接入简历的个人项目数据，不参与打包。
const modules = import.meta.glob<Record<string, unknown>>(
  ['./*.ts', '!./index.ts', '!./personal-projects.ts'],
  { eager: true },
) as Modules

const pick = <T>(file: string, key: string): T | undefined =>
  modules[`./${file}`]?.[key] as T | undefined

export const realData: {
  personalInfo?: PersonalInfo
  personalSkills?: PersonalSkills
  languages?: Language[]
  education?: Education[]
  advantages?: string[]
  workExperience?: WorkExperience[]
  projects?: Project[]
  openSource?: OpenSourceProject[]
} = {
  personalInfo: pick<PersonalInfo>('personal-info.ts', 'personalInfo'),
  personalSkills: pick<PersonalSkills>('personal-skills.ts', 'personalSkills'),
  languages: pick<Language[]>('languages.ts', 'languages'),
  education: pick<Education[]>('education.ts', 'education'),
  advantages: pick<string[]>('advantages.ts', 'advantages'),
  workExperience: pick<WorkExperience[]>(
    'work-experience.ts',
    'workExperience',
  ),
  projects: pick<Project[]>('projects.ts', 'projects'),
  openSource: pick<OpenSourceProject[]>('open-source.ts', 'openSource'),
}

/** 是否检测到了完整的真实数据 */
export const hasRealData = Object.values(realData).every((v) => v !== undefined)
