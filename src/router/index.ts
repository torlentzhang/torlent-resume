import { createRouter, createWebHashHistory } from 'vue-router'
import ResumeHomePage from '@/pages/index.vue'

const router = createRouter({
  // hash 模式：静态托管、子路径部署与直接刷新时都不需要服务端 rewrite
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'resume-home',
      component: ResumeHomePage,
    },
  ],
})

export default router
