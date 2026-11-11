import type { ResumeTemplate } from '@/types'

/**
 * 模板注册表。
 * 用 glob 自动收集各模板目录的 index.ts，新增模板只需建目录，无需改这里。
 */
const modules = import.meta.glob<{ default: ResumeTemplate }>('./*/index.ts', { eager: true })

export const DEFAULT_TEMPLATE_ID = 'default'

export const resumeTemplates: ResumeTemplate[] = Object.values(modules)
  .map((module) => module.default)
  .sort((a, b) => {
    if (a.id === DEFAULT_TEMPLATE_ID) return -1
    if (b.id === DEFAULT_TEMPLATE_ID) return 1
    return a.id.localeCompare(b.id)
  })

export function getResumeTemplate(id: string): ResumeTemplate {
  return resumeTemplates.find((template) => template.id === id) ?? resumeTemplates[0]
}
