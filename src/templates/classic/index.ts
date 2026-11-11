import type { ResumeTemplate } from '@/types'
import ClassicDocument from './ClassicDocument.vue'

const classicTemplate: ResumeTemplate = {
  id: 'classic',
  name: '经典单栏',
  description: '单栏黑白灰，分页交给浏览器原生分页',
  flow: ClassicDocument,
}

export default classicTemplate
