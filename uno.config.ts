import { defineConfig, presetWind3, transformerDirectives } from 'unocss'

/**
 * UnoCSS 配置 —— 本项目样式的唯一入口。
 *
 * 约定：
 * 1. 不覆盖 presetWind3 的任何 theme 键。需要自定义就新增独立命名（ink / rule / paper 等），
 *    绝不改 text-sm、p-4 这类预设工具类的含义。
 * 2. 纸张尺寸、内边距只在这里定义，style.scss 不再持有 --a4-* 变量。
 * 3. shortcut 只提炼「大量复用」或「新建模板一定会用」的样式。单点样式写在组件里：
 *    组件内复用的用 <style scoped> 里的 --at-apply，只用一次的直写工具类。
 */
export default defineConfig({
  presets: [presetWind3()],

  // 支持在 <style scoped> 里用 --at-apply 复用工具类
  transformers: [transformerDirectives()],

  theme: {
    // 纸张几何：210×297mm，内边距上下 12mm、左右 18mm
    width: { a4: '210mm' },
    height: { a4: '297mm' },
    // p-* 工具类查的是 theme.spacing
    spacing: { a4: '12mm 18mm' },

    colors: {
      // classic 的黑白灰层级
      ink: {
        DEFAULT: '#111',
        soft: '#333',
        muted: '#555',
        faint: '#777',
        hint: '#888',
        title: '#666',
        deep: '#222',
      },
      rule: {
        DEFAULT: '#d4d4d4',
        dotted: '#e0e0e0',
      },
      paper: '#ffffff',
      canvas: '#f5f5f5',

      // 沿用旧 tailwind.config.js 的自定义色
      primary: '#165DFF',
      'text-primary': '#1D2129',
      'text-secondary': '#4E5969',
      border: '#E5E6EB',
      'tag-bg': '#F2F3F5',
    },

    boxShadow: {
      paper: '0 12px 32px rgba(0, 0, 0, .12)',
    },

    letterSpacing: {
      title: '0.14em',
      name: '0.04em',
      role: '0.06em',
    },
  },

  shortcuts: [
    // ---------- 纸张 ----------
    // 一张 A4：尺寸 / 内边距 / 白底 / 裁切 / 打印分页。新模板必用。
    // 内容溢出直接裁掉，由作者控制内容量。
    {
      'a4-sheet':
        'w-a4 h-a4 p-a4 bg-paper overflow-hidden box-border print:[&:not(:last-child)]:break-after-page',
    },
    // default 模板的旧容器需要单页 grid 骨架（标题行 + 正文行），随 default 一起删
    {
      'resume-grid-sheet':
        'w-a4 h-a4 p-a4 bg-paper overflow-hidden box-border grid grid-rows-[auto_minmax(0,1fr)] [align-content:start] gap-0',
    },

    // ---------- 版块 ----------
    [
      'section-title',
      'pb-[5px] border-b border-rule text-xs font-bold tracking-title text-gray-900 print:break-after-avoid print:break-inside-avoid',
    ],
    ['section-block', 'mt-[22px]'],

    // ---------- 条目 ----------
    ['section-item-block', 'mt-3'],

    // ---------- 内容 ----------
    // 项目符号用 before: 伪元素；400+ 条要点复用
    [
      'bullet',
      [
        'relative pl-3 text-xs text-ink-soft',
        'before:content-[""] before:absolute before:left-0 before:top-[0.72em]',
        'before:w-[3px] before:h-[3px] before:bg-ink',
      ].join(' '),
    ],
  ],
})
