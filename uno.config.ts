import { defineConfig, presetWind3 } from 'unocss'

/**
 * UnoCSS 配置 —— 本项目样式的唯一管理入口。
 *
 * 约定：
 * 1. 纸张尺寸只在 src/style/style.scss 的 :root 里定义一次，这里只做 var() 映射，
 *    不出现第二套 210mm/297mm 字面量。
 * 2. classic 模板的版式全部用工具类 + shortcuts 表达，组件里不再写 <style scoped>。
 * 3. 唯一无法用工具类表达的是 CSS 的 `page` 属性（具名页面），用 rules 补一条。
 */
export default defineConfig({
  presets: [presetWind3()],

  rules: [
    // UnoCSS 没有内置 `page` 属性工具类；打印分页依赖它绑定 @page classic
    [/^page-(\w+)$/, ([, name]) => ({ page: name })],
  ],

  theme: {
    width: { a4: 'var(--a4-width)' },
    height: { a4: 'var(--a4-height)' },
    // 注意：p-* 工具类查的是 theme.spacing，写成 theme.padding 会静默失效
    spacing: { a4: 'var(--a4-padding)' },

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

    /**
     * 字号全部用 px 固定，不随浏览器默认字号缩放，保证版面高度可预测。
     *
     * A 组：旧 Tailwind 档位，原先是 ResumeSheet 里 :deep() 覆盖的 7 条，
     *       搬进 theme 后纸内纸外同一类名同值。
     * B 组：classic 专用语义档位。
     */
    fontSize: {
      xs: ['13px', '18px'],
      sm: ['16px', '23px'],
      base: ['18px', '26px'],
      lg: ['20px', '28px'],
      xl: ['22px', '30px'],
      '2xl': ['26px', '34px'],
      '3xl': ['32px', '40px'],

      'profile-name': ['17px', '22px'],
      'profile-role': ['10.5px', '15px'],
      contact: ['11px', '16px'],
      section: ['12px', '16px'],
      body: ['12px', '21.6px'],
      entry: ['12px', '18px'],
      'entry-meta': ['10.5px', '16px'],
      tag: ['10px', '15px'],
      avatar: ['20px', '24px'],
    },
  },

  shortcuts: [
    // ---------- 纸张 ----------
    // 固定纸张：default 模板的 ResumeSheet 用。
    // 单页骨架是 grid：标题行自动高度，正文占满剩余行。
    {
      'a4-sheet':
        'w-a4 h-a4 p-a4 bg-paper overflow-hidden box-border grid grid-rows-[auto_minmax(0,1fr)] [align-content:start] gap-0',
    },
    // 流式文档：屏幕是纸张内容区，打印交给原生分页（边距由 @page classic 提供）
    {
      'doc-sheet':
        'w-a4 p-a4 bg-paper box-border shadow-paper print:w-auto print:p-0 print:shadow-none page-classic',
    },

    // ---------- 版块 ----------
    ['section-title', 'pb-[5px] border-b border-rule text-section font-bold tracking-title text-gray-900 print:break-after-avoid print:break-inside-avoid'],
    ['section-block', 'mt-[22px] print:mt-4'],

    // ---------- 条目 ----------
    // 条目整体允许跨页，只有条目头保持与下一条 bullet 同页
    ['entry-block', 'mt-2 print:break-inside-auto'],
    ['entry-head', 'print:break-after-avoid print:break-inside-avoid'],
    ['entry-row', 'flex items-baseline justify-between gap-4'],
    ['entry-title', 'text-entry font-bold text-ink'],
    ['entry-sub', 'ml-2 text-entry font-medium text-ink-muted'],
    ['entry-meta', 'flex-none text-entry-meta text-ink-faint'],

    // ---------- bullet ----------
    // 项目符号用 before: 伪元素，与原来的 ::before 完全等价
    [
      'bullet',
      [
        'relative pl-3 text-body text-ink-soft',
        'before:content-[""] before:absolute before:left-0 before:top-[0.72em]',
        'before:w-[3px] before:h-[3px] before:bg-ink',
        'print:break-inside-avoid',
      ].join(' '),
    ],

    // ---------- 项目头 ----------
    ['project-tags', 'mt-px text-tag text-ink-hint break-anywhere'],

    // ---------- 个人信息 ----------
    // 两列同属一个 grid 行，天然等高；左列头像 + 姓名 + 岗位贴底
    ['profile-grid', 'grid grid-cols-[112px_minmax(0,1fr)] gap-6 items-stretch pb-3 border-b border-ink print:break-inside-avoid'],
    ['profile-identity', 'grid grid-rows-[auto_1fr_auto_auto] justify-items-center text-center'],
    ['profile-name', 'row-start-3 text-profile-name font-bold tracking-name text-ink'],
    ['profile-role', 'row-start-4 mt-0.5 text-profile-role tracking-role text-ink-title'],
    ['profile-avatar', 'w-[66px] h-[66px] rounded-full border border-gray-300 object-cover grayscale'],
    ['profile-avatar-fallback', 'flex w-[66px] h-[66px] items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-ink-faint'],
    // 行高必须是 auto：行被 1fr 拉高后文字仍贴行顶、下边框在行底，会出现错位
    ['profile-meta', 'grid grid-cols-2 grid-auto-rows-[auto] content-center gap-x-[22px]'],
    ['contact-row', 'flex items-baseline gap-2 py-[3px] text-contact border-b border-dotted border-rule-dotted'],
    ['contact-label', 'w-12 flex-none text-ink-hint'],
    ['contact-value', 'min-w-0 text-ink-deep break-anywhere'],
  ],
})
