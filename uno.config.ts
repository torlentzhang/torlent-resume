import { defineConfig, presetWind3 } from 'unocss'

/**
 * UnoCSS 配置 —— 本项目样式的唯一入口。
 *
 * 约定：
 * 1. 不覆盖 presetWind3 的任何 theme 键。需要自定义就新增独立命名（ink / rule / paper 等），
 *    或写 shortcut，绝不改 text-sm、p-4 这类预设工具类的含义。
 * 2. 纸张尺寸、边距只在这里定义，style.scss 不再持有 --a4-* 变量。
 * 3. 组件里不写 <style>，版式全部由工具类与 shortcut 表达。
 */
export default defineConfig({
  presets: [presetWind3()],

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
    // 一张 A4：尺寸 / 内边距 / 白底 / 裁切 / 打印分页。
    // 内容溢出直接裁掉，由作者自己控制内容量，不做任何高度监测。
    {
      'a4-sheet':
        'w-a4 h-a4 p-a4 bg-paper overflow-hidden box-border print:[&:not(:last-child)]:break-after-page',
    },
    // default 模板的旧容器仍需要单页 grid 骨架（标题行 + 正文行）
    {
      'resume-grid-sheet':
        'w-a4 h-a4 p-a4 bg-paper overflow-hidden box-border grid grid-rows-[auto_minmax(0,1fr)] [align-content:start] gap-0',
    },

    // ---------- 版块 ----------
    ['section-title', 'pb-[5px] border-b border-rule text-xs font-bold tracking-title text-gray-900 print:break-after-avoid print:break-inside-avoid'],
    ['section-block', 'mt-[22px]'],

    // ---------- 条目 ----------
    ['entry-block', 'mt-2'],
    ['entry-row', 'flex items-baseline justify-between gap-4'],
    ['entry-title', 'text-xs font-bold text-ink'],
    ['entry-sub', 'ml-2 text-xs font-medium text-ink-muted'],
    ['entry-meta', 'flex-none text-xs text-ink-faint'],

    // ---------- bullet ----------
    // 项目符号用 before: 伪元素
    [
      'bullet',
      [
        'relative pl-3 text-xs text-ink-soft',
        'before:content-[""] before:absolute before:left-0 before:top-[0.72em]',
        'before:w-[3px] before:h-[3px] before:bg-ink',
      ].join(' '),
    ],

    // ---------- 项目头 ----------
    ['project-tags', 'mt-px text-[10px] leading-[15px] text-ink-hint break-anywhere'],

    // ---------- 个人信息 ----------
    // 两列同属一个 grid 行，天然等高；左列头像 + 姓名 + 岗位贴底
    ['profile-grid', 'grid grid-cols-[112px_minmax(0,1fr)] gap-6 items-stretch pb-3 border-b border-ink'],
    ['profile-identity', 'grid grid-rows-[auto_1fr_auto_auto] justify-items-center text-center'],
    ['profile-name', 'row-start-3 text-lg font-bold tracking-name text-ink'],
    ['profile-role', 'row-start-4 mt-0.5 text-[10.5px] leading-[15px] tracking-role text-ink-title'],
    ['profile-avatar', 'w-[66px] h-[66px] rounded-full border border-gray-300 object-cover grayscale'],
    ['profile-avatar-fallback', 'flex w-[66px] h-[66px] items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-ink-faint'],
    // 行高必须是 auto：行被 1fr 拉高后文字仍贴行顶、下边框在行底，会出现错位
    ['profile-meta', 'grid grid-cols-2 grid-auto-rows-[auto] content-center gap-x-[22px]'],
    ['contact-row', 'flex items-baseline gap-2 py-[3px] text-[11px] leading-4 border-b border-dotted border-rule-dotted'],
    ['contact-label', 'w-12 flex-none text-ink-hint'],
    ['contact-value', 'min-w-0 text-ink-deep break-anywhere'],
  ],
})
