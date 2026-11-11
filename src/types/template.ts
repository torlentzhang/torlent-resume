import type { Component } from 'vue'

/**
 * 简历模板元数据。
 * pages 的数组顺序即最终页序，每个元素对应一张 A4（静态模板）。
 * flow 用于页数在运行时才确定的流式模板，二者取其一。
 */
export interface ResumeTemplate {
  id: string
  name: string
  description?: string
  pages?: Component[]
  flow?: Component
}
