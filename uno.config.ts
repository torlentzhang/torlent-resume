import { defineConfig, presetWind3 } from 'unocss'

/**
 * UnoCSS 配置。
 *
 * 预设选 presetWind3：默认色板、工具类语义、space-y 实现都与 Tailwind 3 一致，
 * 从 Tailwind 3 迁移过来观感零差异。升级到 wind4 需要逐档对齐 OKLCH 色板，留到后续单独做。
 *
 * 纸张尺寸不在本文件写字面量：`a4` 系列键映射到 style.scss 里 :root 的 --a4-* 变量，
 * 保证「一处定义、两处引用」，不会出现第二套纸张尺寸。
 */
export default defineConfig({
  presets: [presetWind3()],

  theme: {
    width: { a4: 'var(--a4-width)' },
    height: { a4: 'var(--a4-height)' },
    padding: { a4: 'var(--a4-padding)' },

    colors: {
      // classic 模板的黑白灰层级
      ink: {
        DEFAULT: '#111',
        soft: '#333',
        muted: '#555',
        faint: '#777',
        hint: '#888',
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
     * 字号统一用 px 固定，不随浏览器默认字号缩放，保证版面高度可预测。
     *
     * A 组：旧 Tailwind 档位，原先是 ResumeSheet 里 :deep() 覆盖的 7 条，
     *       搬进 theme 后纸内纸外同一类名同值，:deep() 可以整块删除。
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

  shortcuts: {
    // 固定纸张：default 模板的 ResumeSheet 用
    'a4-sheet': 'w-a4 h-a4 p-a4 bg-paper overflow-hidden box-border',
    // 流式文档：屏幕是纸张内容区，打印交给原生分页（边距由 @page 提供）
    'doc-sheet':
      'w-a4 p-a4 bg-paper box-border shadow-paper print:w-auto print:p-0 print:shadow-none',
    'section-title':
      'pb-[5px] border-b border-rule text-section font-bold tracking-title text-ink',
    'entry-row': 'flex items-baseline justify-between gap-4',
    'entry-title': 'text-entry font-bold text-ink',
    'entry-sub': 'ml-2 font-medium text-ink-muted',
    'entry-meta': 'flex-none text-entry-meta text-ink-faint',
    'project-tags': 'mt-px text-tag text-ink-hint break-anywhere',
    'contact-row':
      'flex items-baseline gap-2 py-[3px] text-contact border-b border-dotted border-rule-dotted',
    'contact-label': 'flex-none w-12 text-ink-hint',
    'contact-value': 'min-w-0 text-ink break-anywhere',
    'profile-meta': 'grid grid-cols-2 gap-x-[22px] content-center',
    'profile-avatar':
      'w-[66px] h-[66px] rounded-full object-cover border border-rule grayscale',
  },
})
