import type { WorkExperience } from "@/type/types";

export const workExperience: WorkExperience[] = [
  {
    company: "字节跳动",
    position: "高级前端开发工程师 / 前端技术负责人",
    period: "2021.03 - 至今",
    location: "北京",
    responsibilities: [
      "负责抖音电商平台前端架构设计与技术选型，主导多个核心业务模块的开发与重构工作",
      "带领8人前端团队，负责项目进度管理、代码Review、技术方案评审等工作，保障项目高质量交付",
      "主导前端性能优化专项，通过代码分懒加载、懒加载、缓存策略等手段，将页面首屏加载时间从2.8s优化到1.2s，提升用户体验",
    ],
    achievements: [],
  },
  {
    company: "阿里巴巴",
    position: "前端开发工程师",
    period: "2020.07 - 2021.02",
    location: "杭州",
    responsibilities: [
      "参与淘宝移动端核心业务模块开发，负责商品列表页、购物车等核心页面的开发与维护",
      "参与前端组件库建设，开发通用组件20+，被多个业务线复用，减少重复开发工作量",
      "参与性能优化专项，将移动端页面首屏加载时间优化提升40%，用户留存率提升5%",
    ],
    achievements: [],
  },
];
