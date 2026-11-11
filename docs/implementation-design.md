# 简历流式模板 + UnoCSS 实现设计

> 定位：`docs/architecture-design.md` 讲「为什么这样做」，本文讲「照着怎么写」。
> 状态：**实现已回退**。当前仓库只有一个单页 `classic` 模板；流式改造与 UnoCSS 迁移都是**待实施**的设计。
> 文中 `[已存在]` 标注回退后保留的基础设施，`[待做]` 标注尚未落地、等确认后按 §8 开工的部分。

---

## 0. 当前状态与本期决策

### 0.1 已保留（回退边界内保留）

| 项 | 状态 |
|---|---|
| 路由 | `src/router/` + `src/pages/index.vue` + `App.vue` 的 `<RouterView />` 壳 |
| 纸张 | `src/components/page/ResumeSheet.vue`（`default` 模板用，固定 A4 三页） |
| 样式 | `src/style/style.scss` + Sass |
| 模板机制 | `registry.ts` + `default` 静态三页 + `classic` 单页 + 切换器 |
| 类型 | `src/types/`（`index.ts` 统一出口，`resume.ts` / `template.ts`） |
| 包管理 | npm，`package-lock.json` |
| 文档 | `docs/architecture-design.md`、`docs/implementation-design.md` |

### 0.2 本期决策：浏览器原生分页

**不再自己做行数估算和分页。** 整份简历渲染成一条连续文档，分页交给浏览器：

- 打印版式由 `@page` + `break-*` 规则控制，**打印结果 100% 精确**，不存在估算偏差；
- 屏幕上是**一条连续的白色窄栏**（宽度与纸张内容区一致），不画一页页纸的边界；
- 代价：屏幕上看不到分页位置，需要按 Ctrl+P 预览确认。

采纳这个取舍的原因：`A4` 式固定高度容器带 `overflow: hidden`，估算一旦偏小就会**静默裁掉内容**，
而这是简历最不能接受的失败模式。原生分页没有这个失败模式——放不下就自动推到下一页。

因此以下内容**全部不做**，从设计中删除：

- `src/utils/metrics.ts`、`src/utils/paginate.ts`（行数估算与装箱）
- `src/types/flow.ts`（`Block` / `PageBlock` / `ResumePageModel`）
- `src/components/BlockRenderer.vue`（块间距渲染）
- `src/components/A4.vue`（固定纸张容器，改造后无人使用 → 删除）
- 溢出红框、`scrollHeight` 测量、`ResizeObserver`、任何渲染期断言

### 0.3 当期内容范围（已定）

| 版块 | 是否展示 | 说明 |
|---|---|---|
| 个人信息 | ✅ | 姓名 / 意向岗位 / 联系方式 |
| 个人优势 | ✅ | `advantages` |
| 工作经历 | ✅ | `workExperience`，职责 + 业绩合并为 bullet |
| 项目经历 | ✅ | `projects` |
| 开源项目 | ✅ | `openSource`（**个人项目即开源项目**，`personal-projects.ts` 不接入） |
| 教育背景 | ✅ | `education` |
| 语言能力 | ✅ | `languages`，独立版块 |
| 专业技能 | ❌ | 只是技术栈罗列，删掉；`personalSkills` 类型与数据保留不动 |

### 0.4 目录约定（硬约定）

1. 类型只在 `src/types/` 定义，业务代码只从 `@/types` 引用。
2. 不再出现 `src/type/types.ts`、`src/templates/types.ts` 这类分散的类型文件。
3. 包管理器统一 npm：`npm install` / `npm run dev` / `npm run build`。

---

## 1. 文件树（目标态）

```
src/
├── main.ts                              # [已存在] 挂 router + 全局样式
├── App.vue                              # [已存在] 仅 <RouterView />
├── router/index.ts                      # [已存在] hash 模式，/ → pages/index.vue
├── pages/index.vue                      # [已存在] 控制器：模板切换 + 打印导出
├── types/
│   ├── index.ts                         # [已存在] export * from './resume' / './template'
│   ├── resume.ts                        # [已存在] ResumeData / PersonalInfo / …
│   └── template.ts                      # [已存在] ResumeTemplate（pages | flow）
├── data/index.ts                        # [已存在] 真实数据优先，否则演示数据
├── mydata/index.ts                      # [已存在] glob 收集本地私有数据
├── style/style.scss                     # [已存在] Tailwind 入口 + @page，[待改] 换 UnoCSS reset
├── components/
│   └── page/ResumeSheet.vue             # [已存在] default 模板的单页壳，[待改] 去 :deep()
└── templates/
    ├── registry.ts                      # [已存在] glob 自动注册
    ├── default/index.ts                 # [已存在] 静态三页
    └── classic/
        ├── index.ts                     # [待改] pages: [page-1] → flow: ClassicDocument
        ├── ClassicDocument.vue          # [待做] 流式文档：读数据 + 版块顺序 + 打印规则
        └── blocks/                      # [待做] 版块组件
            ├── ProfileHeader.vue
            ├── SectionTitle.vue
            ├── EntryHead.vue
            ├── Bullet.vue
            └── ProjectHead.vue

uno.config.ts                            # [待做] 唯一新增的配置文件
```

**删除**：`src/components/A4.vue`、`src/templates/classic/pages/page-1.vue`（及其 `pages/` 目录）。

### 1.1 每个文件的职责与导出

| 文件 | 导出 | 职责 |
|---|---|---|
| `ClassicDocument.vue` `[待做]` | 默认导出组件 | 唯一读 `resumeData` 的地方；决定版块顺序；承载打印版式 |
| `blocks/ProfileHeader.vue` `[待做]` | 默认导出组件 | 头像 + 姓名 + 岗位 + 联系方式栅格 |
| `blocks/SectionTitle.vue` `[待做]` | 默认导出组件 | 版块标题 + 下边框 |
| `blocks/EntryHead.vue` `[待做]` | 默认导出组件 | 左右两端条目头（工作/教育） |
| `blocks/Bullet.vue` `[待做]` | 默认导出组件 | 悬挂项目符号的单条文本 |
| `blocks/ProjectHead.vue` `[待做]` | 默认导出组件 | 项目名（可选链接）+ 时间 + 标签行 |
| `classic/index.ts` | `default: ResumeTemplate` | 改为 `{ id: 'classic', name: '经典单栏', flow: ClassicDocument }` |

### 1.2 分层

```
pages/index.vue         控制器：维护 activeTemplateId，把模板渲染出来
  └── ClassicDocument   模板层：顺序、版块组合、打印版式；唯一的数据读取点
        └── blocks/*    展示层：只收 props，不读数据，不带纵向 margin
```

`default` 模板走 `pages[]` 静态三页，与 `classic` 完全隔离，本期不动它。

---

## 2. 渲染与打印

### 2.1 屏幕：一条连续窄栏

`ClassicDocument.vue` 根节点即「纸」，屏幕态复刻纸张的内容区：

```
宽度 210mm，内边距 12mm 16mm（box-sizing: border-box）
→ 内容区宽 178mm ≈ 672.76px，与打印完全一致
白底 + 投影，居中
```

因为容器**高度自适应**，内容变多变少都不会被裁切，滚动即可看到全文。

### 2.2 打印：`@page` 给页面留白，容器让出内边距

关键点：**打印时页面边距由 `@page` 提供，容器自身的 padding 必须归零**，否则边距翻倍
（内容区会从 178mm 缩到 146mm）。

```css
@page classic {
  size: A4;
  margin: 12mm 16mm;
}

.classic-doc {
  page: classic;          /* 绑定到上面的具名页面 */
}

@media print {
  .classic-doc {
    width: auto;
    padding: 0;
    box-shadow: none;
  }
}
```

用**具名页面**（`@page classic` + `page: classic`）而不是改全局 `@page`，是因为
`default` 模板的 `ResumeSheet` 自带 297mm 固定高度 + 自带 padding，必须保持全局
`@page { margin: 0 }` 不变。两种分页语义靠具名页面并存，互不干扰。

> 兼容性：`page` 属性 Chrome 85+ / Safari 15.4+ 支持。若目标浏览器不支持，退化为
> 页面边距为 0、内容贴边打印——版式变丑但不会崩。这是可接受的降级，不额外做 hack。

### 2.3 断页规则

只允许在版块之间、条目之间断开，**不允许**切开单个条目或单条 bullet：

| 选择器 | 规则 | 目的 |
|---|---|---|
| `.classic-section__title` | `break-after: avoid` + `break-inside: avoid` | 标题不许落在页尾，必须跟住正文 |
| `.classic-entry` | `break-inside: avoid` | 一段工作/项目/教育不被拆开 |
| `.classic-bullet` | `break-inside: avoid` | 一条 bullet 不跨页 |
| `p, li` | `orphans: 2; widows: 2` | 段落至少留 2 行在页首/页尾 |

> 单个条目高于一整页时（超长项目），浏览器会忽略 `break-inside: avoid` 强行断开——
> 这是正确行为，不需要特殊处理。

### 2.4 版块之间的间距

版块间距用 `margin-top` 表达，**不用 `gap`**：`gap` 依赖 flex/grid 容器，而跨页容器
用 `display: block` 最稳（flex 容器跨页在 Chrome 里容易产生空白页）。

首个版块用 `margin-top: 0`（`:first-child` 或直接不给）。

---

## 3. 版块顺序与内容映射

顺序即 `ClassicDocument.vue` 模板里组件的书写顺序。

| # | 版块 | 数据 | 块内结构 |
|---|---|---|---|
| 1 | 个人信息 | `personalInfo` | 头像 + 姓名 + 意向岗位；右侧联系方式两列栅格 |
| 2 | 个人优势 | `advantages` | 标题 + 逐条 bullet |
| 3 | 工作经历 | `workExperience` | 每条：条目头（公司 + 职位 / 时间 · 地点）+ `responsibilities` 与 `achievements` 合并成 bullet |
| 4 | 项目经历 | `projects` | 每条：项目头（名称 / 时间 + 标签行）+ `description` + 职责 + 业绩 |
| 5 | 开源项目 | `openSource` | 每条：项目头（名称带 GitHub 链接 / 时间 + `meta`）+ `description` + 功能 + 亮点 + 贡献 |
| 6 | 教育背景 | `education` | 每条：条目头（学校 + 专业 / 时间 · 地点）+ `highlights` |
| 7 | 语言能力 | `languages` | 每条一行：`名称（等级）` + 描述 |

约定：

- 任一版块数组为空时**整块不渲染**（含标题），不留空白间距。
- 版块组件的 props 由 `ClassicDocument.vue` 传入，组件内部不 `import resumeData`。
- 「专业技能」不出现；`personalSkills` 不进任何组件。

---

## 4. 组件契约

所有组件均**无 emits**、无内部状态（除头像加载失败标记）。

| 组件 | props | 说明 |
|---|---|---|
| `ProfileHeader.vue` | `info: PersonalInfo` | 头像缺失时显示姓名首字占位，尺寸不变 |
| `SectionTitle.vue` | `text: string` | 单个 `<h2>`，带下边框 |
| `EntryHead.vue` | `title: string`、`subtitle?: string`、`period?: string`、`location?: string` | 左 `title` + `subtitle`，右 `period · location` |
| `Bullet.vue` | `text: string` | 单个 `<li>` 或 `<p>`，悬挂 3px 方点 |
| `ProjectHead.vue` | `name: string`、`href?: string`、`period?: string`、`tags?: string[]`、`techStack?: string[]` | 第一行名称 + 时间；第二行标签与技术栈用 `/` 连接 |

约定：

1. 展示组件只收 props，**不读 `resumeData`**；唯一读数据的是 `ClassicDocument.vue`。
2. 展示组件根节点**不带纵向 `margin`**，版块间距由 `ClassicDocument.vue` 给。
3. 展示组件根节点不得 `position: fixed/absolute`，否则脱离分页流。
4. 展示组件不得自带 `overflow: hidden`，否则会裁掉跨页内容。

---

## 5. 排版规格

单位 px；「间距」未特别说明时由 `ClassicDocument.vue` 统一给。

| 元素 | 字号/行高 | 字重 | 颜色 | 其它 |
|---|---|---|---|---|
| 头像 | — | — | — | 66×66，`border-radius: 50%`，1px `#d4d4d4`，`grayscale(100%)`，`object-fit: cover` |
| 头像占位 | 20/24 | 400 | `#777` | 背景 `#f5f5f5`，居中显示姓名首字 |
| 姓名 | 17/22 | 700 | `#111` | `letter-spacing: .04em`，`margin-top: 7px` |
| 意向岗位 | 10.5/15 | 400 | `#666` | `letter-spacing: .06em`，`margin-top: 2px` |
| 个人信息区 | — | — | — | `display:flex`，`gap:24px`，左栏固定 112px 居中，`padding-bottom:12px`，`border-bottom:1px solid #111` |
| 联系信息栅格 | — | — | — | 两列 `1fr`，`gap: 0 22px`，`align-content:center` |
| 联系行 | 11/16 | 400 | 值 `#222` | `display:flex`，`gap:8px`，`padding:3px 0`，`border-bottom:1px dotted #e0e0e0` |
| 联系行标签 | 11/16 | 400 | `#888` | 固定宽 48px，不换行 |
| 版块标题 | 12/16 | 700 | `#111` | `letter-spacing:.14em`，`padding-bottom:5px`，`border-bottom:1px solid #d4d4d4` |
| 条目头容器 | — | — | — | `display:flex`，`justify-content:space-between`，`align-items:baseline`，`gap:16px` |
| 条目头主标题 | 12/18 | 700 | `#111` | — |
| 条目头副标题 | 12/18 | 500 | `#555` | `margin-left:8px` |
| 条目头元信息 | 10.5/16 | 400 | `#777` | `flex:none`，格式 `时间 · 地点` |
| bullet | 12/21.6 | 400 | `#333` | `padding-left:12px`，`::before` 3×3 `#111`，`top:.72em` |
| 项目名 | 12/18 | 700 | `#111` | 开源项目名为 `<a>`，`text-decoration:none`，打印时保留黑色 |
| 项目时间 | 10.5/16 | 400 | `#777` | `flex:none` |
| 项目标签/技术栈 | 10/15 | 400 | `#888` | `margin-top:1px`，`overflow-wrap:anywhere`，`/` 连接 |
| 版块间距 | — | — | — | 版块之间 `margin-top: 1.2em`（≈26.4px）；条目之间 `8px`；bullet 之间 `4px` |
| 纸张（屏幕） | — | — | 白底 | 210mm 宽，内边距 `12mm 16mm`，`box-sizing:border-box`，`0 12px 32px rgba(0,0,0,.12)` 投影，居中 |
| 纸张（打印） | — | — | 白底 | 宽度自适应，内边距 0，无投影；页面边距由 `@page classic` 提供 |

---

## 6. UnoCSS 设计

### 6.1 依赖与接入

| 项 | 做法 |
|---|---|
| 依赖 | 安装 `unocss`；移除 `tailwindcss`、`tailwind.config.js` |
| 预设 | **`presetWind3`（定案）**。默认色板、工具类语义、`space-y` 实现与 Tailwind 3 一致，迁移前后观感零差异。升级 wind4 留到后续单独评估 |
| Vite | `vite.config.ts` 的 `plugins` 加 `UnoCSS()`，配置从根目录 `uno.config.ts` 自动读取 |
| 样式入口 | `main.ts` 按序 import：`./style/style.scss` 之后追加 `virtual:uno.css`；reset 放最前 |
| Reset | `main.ts` 首行 `import '@unocss/reset/tailwind.css'`；`style.scss` 删除三行 `@tailwind` |
| PostCSS | `postcss.config.js` 只留 `autoprefixer`；不接 UnoCSS 的 PostCSS 插件 |

`main.ts` 的 import 顺序（顺序即层叠顺序）：

```ts
import '@unocss/reset/tailwind.css'  // 1. 清零
import 'virtual:uno.css'             // 2. 工具类
import './style/style.scss'          // 3. 项目全局样式
```

> reset 必须最先。若把 reset 写在 `style.scss` 里、却先引入 `virtual:uno.css`，
> 清零规则会排在工具类之后，当前能正常显示只是靠「元素选择器敌不过类选择器」的侥幸。

**这是一次原子切换**：`@tailwind` 与 `tailwindcss` 插件必须同一提交内替换，中间态页面
会完全丢样式、不可运行。

### 6.2 数值唯一来源

纸张尺寸**继续只写在 `style.scss` 的 `:root` 三个变量里**，`uno.config.ts` 只做映射、不复制字面量：

```ts
theme: {
  width:   { a4: 'var(--a4-width)' },
  height:  { a4: 'var(--a4-height)' },
  padding: { a4: 'var(--a4-padding)' },
}
```

> **不要删 `:root` 的 `--a4-*`**。`ResumeSheet.vue` 的 `@media print` 里
> `width/height/padding: var(--a4-*) !important` 是 `default` 模板三页不被内容撑高的唯一保障；
> 变量一删，`var()` 失效、属性回落到内容高度，打印直接崩版。

`@page` 无法用工具类，保留字面量，注释写「与 `:root` 的 `--a4-*` 同步」。

### 6.3 theme 键

| 键 | 值 | 用途 |
|---|---|---|
| `width.a4` / `height.a4` / `padding.a4` | `var(--a4-*)` | 纸张 |
| `colors.ink.DEFAULT` | `#111` | 姓名、标题、bullet 点 |
| `colors.ink.soft` | `#333` | 正文 |
| `colors.ink.muted` | `#555` | 副标题 |
| `colors.ink.faint` | `#777` | 元信息、头像占位 |
| `colors.ink.hint` | `#888` | 联系行标签、标签行 |
| `colors.rule.DEFAULT` | `#d4d4d4` | 版块标题下边线、头像描边 |
| `colors.rule.dotted` | `#e0e0e0` | 联系行点状分隔 |
| `colors.paper` | `#ffffff` | 纸张底色 |
| `colors.canvas` | `#f5f5f5` | 页面背景 |
| `colors.primary` | `#165DFF` | 沿用旧 Tailwind 配置 |
| `colors['text-primary']` | `#1D2129` | 沿用 |
| `colors['text-secondary']` | `#4E5969` | 沿用 |
| `colors.border` | `#E5E6EB` | 沿用 |
| `colors['tag-bg']` | `#F2F3F5` | 沿用 |
| `boxShadow.paper` | `0 12px 32px rgba(0,0,0,.12)` | 纸张投影 |
| `letterSpacing.title` / `name` / `role` | `0.14em` / `0.04em` / `0.06em` | 版块标题 / 姓名 / 岗位 |
| `fontSize.*` | 见 6.4 | 取代 `:deep()` |

> wind3 的默认色板与 Tailwind 3 同源，`blue-*` / `gray-*` 全档位开箱即得，
> **不需要维护色板对照表**。换 wind4 时才需要考虑，届时单独处理。

### 6.4 字号档位（取代 `:deep()`）

`theme.fontSize` 写成 `[size, lineHeight]` 二元组。分两组：

**A. 旧 Tailwind 档位** —— 把 `ResumeSheet.vue` 里 `:deep()` 的 7 条搬进 theme，
覆盖后 `text-xs`~`text-3xl` 在纸内纸外天然一致，`:deep()` 整块删除。

| 类名 | size / line-height |
|---|---|
| `text-xs` | `13px / 18px` |
| `text-sm` | `16px / 23px` |
| `text-base` | `18px / 26px` |
| `text-lg` | `20px / 28px` |
| `text-xl` | `22px / 30px` |
| `text-2xl` | `26px / 34px` |
| `text-3xl` | `32px / 40px` |

**B. classic 专用语义档位**

| 类名 | size / line-height |
|---|---|
| `text-profile-name` | `17px / 22px` |
| `text-profile-role` | `10.5px / 15px` |
| `text-contact` | `11px / 16px` |
| `text-section` | `12px / 16px` |
| `text-body` | `12px / 21.6px` |
| `text-entry` | `12px / 18px` |
| `text-entry-meta` | `10.5px / 16px` |
| `text-tag` | `10px / 15px` |
| `text-avatar` | `20px / 24px` |

### 6.5 shortcuts

| shortcut | 展开（示意） | 使用处 |
|---|---|---|
| `a4-sheet` | `w-a4 h-a4 p-a4 bg-paper overflow-hidden box-border` | `ResumeSheet.vue` 根 |
| `doc-sheet` | `w-a4 p-a4 bg-paper box-border shadow-paper print:w-auto print:p-0 print:shadow-none` | `ClassicDocument.vue` 根 |
| `section-title` | `pb-[5px] border-b border-rule text-section font-bold tracking-title text-ink` | `SectionTitle.vue` |
| `entry-row` | `flex items-baseline justify-between gap-4` | `EntryHead.vue` 根、`ProjectHead.vue` 首行 |
| `entry-title` | `text-entry font-bold text-ink` | 条目头主标题 |
| `entry-sub` | `ml-2 font-medium text-ink-muted` | 条目头副标题 |
| `entry-meta` | `flex-none text-entry-meta text-ink-faint` | 条目头右侧 |
| `project-tags` | `mt-px text-tag text-ink-hint break-anywhere` | 项目标签行 |
| `contact-row` | `flex items-baseline gap-2 py-[3px] text-contact border-b border-dotted border-rule-dotted` | `ProfileHeader.vue` 行 |
| `contact-label` | `flex-none w-12 text-ink-hint` | 联系行标签 |
| `contact-value` | `min-w-0 text-ink break-anywhere` | 联系行值 |
| `profile-meta` | `grid grid-cols-2 gap-x-[22px] content-center` | 联系信息栅格 |
| `profile-avatar` | `w-[66px] h-[66px] rounded-full object-cover border border-rule grayscale` | 头像 |
| `bullet` | `relative pl-3 text-body text-ink-soft before:content-[''] before:absolute before:left-0 before:top-[0.72em] before:w-[3px] before:h-[3px] before:bg-ink` | `Bullet.vue` |

`border-dotted` / `grayscale` / `content-['']` wind3 均支持，无需兜底写法。

### 6.6 类名兼容性核查

切换前用下面两条命令导出全量类名（**必须包含 `:class` 动态绑定**，只抓 `class="` 会漏）：

```bash
grep -RhoE ':?class="[^"]*"' src --include=*.vue
grep -RhoE '(bg|text|border)-(blue|gray)-[0-9]+' src --include=*.vue | sort -u
```

需要覆盖的高风险类：

| 类别 | 具体类名 | 关注点 |
|---|---|---|
| 间距 | `space-y-1/2/3/6`、`gap-1.5`、`mb-1/2/3/4/5/6/8`、`py-0.5` | wind3 用相邻兄弟选择器实现 |
| 尺寸 | `h-1.5`、`h-16/24/32`、`w-16/20/24/32` | 小数档位 |
| 圆角 | `rounded`、`rounded-lg`、`rounded-full` | 默认值 |
| 交互 | `hover:bg-blue-700`、`focus:border-blue-600`、`focus:outline-none`、`focus-visible:*`、`disabled:opacity-50`、`transition-colors` | 变体链路 |
| 布局 | `shrink-0`、`flex-1`、`min-w-0`、`mx-auto`、`list-disc`、`ml-5`、`object-cover` | 语义别名 |
| 颜色 | `bg-primary`、`border-border`、`bg-tag-bg`、`text-text-primary`、`text-text-secondary`、`border-gray-900` | 自定义键命名 |
| 打印 | `.no-print`（自定义类，非工具类） | 不参与 UnoCSS |

### 6.7 文件改动清单

| 动作 | 文件 |
|---|---|
| 新增 | `uno.config.ts` |
| 删除 | `tailwind.config.js` |
| 修改 | `vite.config.ts`（加 `UnoCSS()`）、`postcss.config.js`（去 tailwind）、`package.json`（去 `tailwindcss`）、`src/main.ts`（reset → `virtual:uno.css` → `style.scss`）、`src/style/style.scss`（去 `@tailwind`，**保留 `:root --a4-*`**）、`src/components/page/ResumeSheet.vue`（shortcut + 删 `:deep()`） |
| 可选（最后做） | `src/templates/classic/blocks/*.vue` 改用 shortcut 类名 |

`ResumeSheet.vue` 的 `ResizeObserver` **保留**：它服务 `default` 模板的旧路径，
与 `classic` 的流式渲染不冲突；本次只删字号 `:deep()`。

---

## 7. 数据与兜底

### 7.1 数据契约：本期无需改动

- `ResumeData` 不加字段：`openSource` 已存在，直接渲染；`personalProjects` 不接入
  （个人项目即开源项目），`mydata/index.ts` 的 glob 继续排除 `personal-projects.ts`。
- `hasRealData` 的 `Object.values(realData).every()` **本期不改**：没有新增可选字段，
  不存在误判风险。若以后新增可选字段，必须改成显式必选白名单，否则整份真实数据会静默回退演示数据。
- `personalSkills` 类型与数据保留，只是不渲染。

### 7.2 运行期兜底

只保留「不加就会崩页面」的处理：

| 场景 | 行为 |
|---|---|
| 某版块数据为空 | 整块不渲染（含标题），不留空白间距 |
| 头像为空或加载失败 | 显示姓名首字占位，尺寸不变 |
| 真实数据缺失 | 沿用现有回退：整体回退演示数据 |

不做的事：溢出红框、`scrollHeight` 测量、字体就绪等待、按页轮询检查。

---

## 8. 实施顺序

> 验收与测试全部由人工在浏览器里完成（屏幕预览 + 打印预览），本文不设验收条目，也不写单元测试。
> 每阶段结束提交一次 commit。

### 阶段 A：经典单栏流式改造

| # | 步骤 | 涉及文件 |
|---|---|---|
| A1 | 版块组件 | `templates/classic/blocks/` 五个组件 |
| A2 | 文档组件 | `templates/classic/ClassicDocument.vue`（含 `@page classic` + 断页规则） |
| A3 | 注册与切换 | `templates/classic/index.ts`（`pages` → `flow`）；`pages/index.vue` 的 `.resume-list` 打印态改 `display:block` |
| A4 | 清理 | 删 `templates/classic/pages/page-1.vue`、`components/A4.vue` |

### 阶段 B：UnoCSS 迁移（wind3）

阶段 A 完成后开工，两阶段不混在一个 commit 里。

| # | 步骤 | 涉及文件 |
|---|---|---|
| B1 | 接入 UnoCSS | `uno.config.ts`（新增）、`vite.config.ts`、`postcss.config.js`、`package.json`、`main.ts`、`style/style.scss` |
| B2 | theme 落地 | `uno.config.ts`：`A4` 变量映射、`fontSize` 两组、`colors`、`boxShadow`、`letterSpacing` |
| B3 | 去 `:deep()` | `components/page/ResumeSheet.vue` 删字号覆盖块，改用 shortcut |
| B4 | 清理 Tailwind | 删 `tailwind.config.js`，卸载 `tailwindcss` |

---

## 9. 仍未定 / 有分歧

1. **屏幕不显示分页边界**：这是方案乙的既定代价。若以后想在屏幕上看到纸的分页位置，
   只能回到「固定高度容器 + 测量」的路线，届时推翻 §2.1。
2. **`default` 模板的去留**：它仍用固定三页的 `ResumeSheet` 与自己的 `break-after` 打印规则，
   与 `classic` 是两套分页语义。`classic` 验收通过后可以考虑删掉整个 `default` 模板，
   届时可一并删除 `ResumeSheet`、`A4` 相关遗留与 `:root --a4-*`。
3. **`ResumeSheet` 的 `ResizeObserver`**：仅服务 `default`；若删除 `default`，它一并删除。
4. **页码 / 页眉页脚**：本期不做。原生分页下可用 `@page @bottom-center { content: counter(page) }`，
   Chrome 对 `content: counter(page)` 支持有限，需要时单独验证。
5. **打印边距的可配置性**：目前 `12mm 16mm` 固定在 `style.scss` 的 `@page classic` 与
   `:root --a4-padding` 两处，改一处要同步另一处。注释已标注这条约束。
