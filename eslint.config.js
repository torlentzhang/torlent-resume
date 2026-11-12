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

  // 补齐 ESLint 核心的 recommended 规则。
  // vueTsConfigs.recommended 里的 eslint-recommended 只负责「关闭与 TS 冲突的核心规则」，
  // 它本身不启用任何规则。typescript-eslint 自带的规则能覆盖 no-unused-vars / no-var 等，
  // 但核心的 no-debugger 没有替代品 —— 实测去掉这一行后 debugger 不会被报错。
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
