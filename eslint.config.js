import { globalIgnores } from 'eslint/config'
import {
  configureVueProject,
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import js from '@eslint/js'
import skipFormatting from 'eslint-config-prettier/flat'

// 允许 .vue 的 script 块使用 ts / tsx
configureVueProject({ scriptLangs: ['ts', 'tsx'] })

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**']),

  // vueTsConfigs.recommended 里的 eslint-recommended 只是「关闭与 TS 冲突的核心规则」，
  // 并不会启用 eslint:recommended。没有这一行，no-debugger / no-unused-vars 等基础规则
  // 全部失效（实测 debugger 不会被报错）。
  js.configs.recommended,

  ...pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

  {
    name: 'app/rules',
    rules: {
      // 组件名单词化不符合本项目命名：A4 / Bullet / Profile 语义完整且不与
      // HTML 元素冲突，index.vue 是路由页与目录入口的约定名
      'vue/multi-word-component-names': 'off',
      // console.warn / console.error 是项目既定用法（数据回退、溢出提示）
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // 必须放最后：关闭所有与 Prettier 冲突的格式规则
  skipFormatting,
)
