import type { PersonalSkills } from '@/types'

/**
 * 占位/演示数据。
 * 真实简历数据放在 src/mydata/ 并已加入 .gitignore，通过 VITE_USE_REAL_DATA 切换。
 */
export const personalSkills: PersonalSkills = {
  frontend: ['HTML5/CSS3', 'JavaScript/ES6+', 'TypeScript', '响应式设计'],
  frameworks: ['Vue.js', 'Next.js', 'Node.js'],
  engineering: ['Webpack/Vite', 'Git/GitFlow', 'CI/CD', '单元测试'],
  other: ['Docker', '微前端', '性能优化'],
}
