import { createApp } from 'vue'
// 顺序即层叠顺序：reset 清零 → 工具类 → 项目全局样式
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import './style/style.scss'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
