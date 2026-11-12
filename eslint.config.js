import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },

  // ES6+ 基础规则（等价于原 eslint:recommended）
  js.configs.recommended,

  // TypeScript 解析 + 规则。项目里有 27 个 .ts 与 11 个 lang="ts" 的 .vue，
  // ESLint 默认解析器读不懂 interface / 类型注解 / as 断言，必须挂 TS 解析器
  ...tseslint.configs.recommended,

  // Vue 规则（flat config 格式）
  ...pluginVue.configs['flat/recommended'],

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // 允许下划线开头的未使用参数
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // console.warn / console.error 是项目既定用法（数据回退、溢出提示）
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // 组件名单词化不符合本项目命名：A4 / Bullet / Profile 语义完整且不与 HTML 元素冲突，
      // index.vue 是路由页与目录入口的约定名
      'vue/multi-word-component-names': 'off',
    },
  },

  // .vue 文件：先由 vue-eslint-parser 解析，script 部分交给 TS 解析器
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  // 必须放最后：关闭所有与 Prettier 冲突的格式规则
  prettier,
)
