import type { ResumeTemplate } from '@/types'
import ClassicPage from './pages/page-1.vue'

const classicTemplate: ResumeTemplate = {
  id: 'classic',
  name: '经典单栏',
  description: '单栏黑白灰，单页版式',
  pages: [ClassicPage],
}

export default classicTemplate
