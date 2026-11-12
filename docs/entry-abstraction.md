# 条目抽象设计：`SectionItem` 统一结构 + 组件与 shortcut 命名重构

> 状态：**设计稿，未实施**。第四版。
> 目标模板：`classic`。本文只描述「版块内条目」层的数据与组件抽象，不涉及分页与打印。
>
> 版本记录：
> - 第一版：`Entry` / 双 Head 组件 —— 已废弃
> - 第二版：`SectionItem` / 合并 Head / 删 `SectionTitle` —— 部分保留
> - 第三版：命名族统一为 `section-item-*`，`ProfileHeader` → `Profile`
> - **第四版：按「大量复用/新模板必用」标准审计 shortcut，删除 15 个单点项，
>   改用 `--at-apply` 与直写工具类** —— 本文

---

## 1. 结构约定（先明确层级，避免歧义）

```
<A4>                                          纸张
  <header>                                    第 1 页页眉（父组件里的语义标签）
    <Profile />                               个人信息区
  </header>

  <section class="section-block">             版块容器
    <h2 class="section-title">工作经历</h2>     版块标题
    <SectionItem>                             版块内的一个条目
      <SectionItemHead />                     条目的头部
      <ul><Bullet /></ul>                     条目的要点
    </SectionItem>
  </section>
</A4>
```

四级关系：

```
A4  →  section  →  SectionItem  →  Bullet
```

两条容易混淆的边界：

1. **`<section>` 是 HTML 语义标签，本身不产生样式**，版块间距由 `section-block` shortcut 给。
   「版块标题」不是一个组件，而是直接写的 `<h2 class="section-title">`。
2. **`<header>` 在父组件（`ClassicDocument.vue`）里**，`Profile` 组件根节点是 `<div>`。
   组件内部不假设自己被放在页眉位置。

---

## 2. 要解决的问题

### 2.1 四种结构几乎同构，但字段名各不相同

| 结构 | 主标题 | 副标题 | 时间 | 地点 | 要点 |
|---|---|---|---|---|---|
| `Education` | `school` | `major` | `period` | `location` | `highlights` |
| `WorkExperience` | `company` | `position` | `period` | `location` | `responsibilities` + `achievements` |
| `Project` | `name` | — | `period` | — | `responsibilities` + `achievements` |
| `PortfolioProject` | `name` | — | `period` | — | `highlights` |

### 2.2 两个头部组件职责重叠

`EntryHead.vue` 与 `ProjectHead.vue` 的实际差异只有一处：前者没有第二行的标签行。
`EntryHead` 本质是 `ProjectHead` 去掉标签行。

### 2.3 模板内做数据拼装

```js
[...work.responsibilities, ...work.achievements]        // 第 52 行
[...project.responsibilities, ...project.achievements]  // 第 109 行
```

### 2.4 条目块模板重复 4 次

`ClassicDocument.vue` 共 162 行，5 个版块占 104 行，其中四个版块的条目块结构完全一致。

### 2.5 命名族不统一

现有术语混用 `entry` / `section` / `profile`：

| 现有 | 问题 |
|---|---|
| `entry-block` / `entry-title` / `entry-sub` / `entry-meta` / `entry-row` | `entry` 单用含义模糊 |
| `section-title` | 与 `entry-*` 不成体系 |
| `ProfileHeader` | 组件根节点是 `<header>`，但它只是第一页的信息区，不是页面页眉 |

---

## 3. 设计边界

**只抽象「版块内的条目」，不抽象「版块」，不引入「模块」层。**

| 层级 | 现状 | 本次是否改动 |
|---|---|---|
| 页 `<A4>` | 手写，手动分页 | ❌ 不动 |
| 页眉 `<header>` + `Profile` | 第 1 页手写 | ⚠️ 只改组件名与根节点标签 |
| 版块 `<section>` + `<h2 class="section-title">` | 手写，5 处 | ⚠️ 删除 `SectionTitle.vue`，改直接写 `<h2>` |
| **版块内条目** | 重复 4 次 | ✅ **抽象为 `SectionItem`** |
| bullet | `Bullet.vue` | ❌ 保留不动 |

### 3.1 为什么不做通用 `<Section>` 组件

| 版块 | 差异 |
|---|---|
| 个人优势 | **没有条目头**，直接是 bullet 列表 |
| 教育背景 | 末尾**额外追加语言能力**段落 |

强行抽象就必须加 `type`、插槽等参数，等于把「手写模板」换成「手写 props」。抽象收益为负。

### 3.2 不引入「模块」层

当前只有「版块」与「条目」两级。若将来需要「配置模块顺序 / 显隐」，再单独设计。

### 3.3 不做 `groups` 结构化分组

作品集的数据里「多租户：…」「C 端首页：…」这类**字符串前缀**保持现状，
不改成 `groups: { label, items }[]` 结构。

理由：
1. 当前没有「分组小标题」的排版需求
2. 字符串拆分是纯机械工作，随时可做
3. 加 `groups` 会让 `SectionItem` 多一层渲染分支

`SectionItem` 的所有扩展字段都是可选的，将来加 `groups` 向后兼容。

---

## 4. `SectionItem` 类型设计

### 4.1 命名由来

| 候选 | 问题 |
|---|---|
| `ResumeItem` | 会被读成「整份简历里的一大块」 |
| `Entry` / `SectionEntry` | `entry` 在 Webpack/Vite 语境里是「入口」 |
| **`SectionItem`** | 明确表示「版块（section）里的一项（item）」 |

层级直观：

```
Section（版块：工作经历）
  └── SectionItem（条目：软通动力）
        └── Bullet（要点：负责 XXX）
```

### 4.2 定义

新增到 `src/types/resume.ts`：

```ts
/**
 * 版块内的一个条目（教育 / 工作 / 项目 / 作品集通用）。
 * 由数据层的转换函数从各自的原始结构映射而来，模板只认这一种形状。
 */
export interface SectionItem {
  /** 主标题：学校 / 公司 / 项目名 */
  title: string
  /** 副标题：专业 / 职位 */
  subtitle?: string
  /** 起止时间 */
  period?: string
  /** 地点 */
  location?: string
  /** 一段概述（项目 / 作品集用） */
  description?: string
  /** 标签（项目 / 作品集用），渲染在头部第二行 */
  tags?: string[]
  /** 技术栈（项目 / 作品集用），与 tags 合并成一行 */
  techStack?: string[]
  /** 外部链接（作品集用） */
  url?: string
  /** 所有要点，已由数据层合并完毕 */
  items: string[]
}
```

### 4.3 字段映射表

| 原始结构 | `title` | `subtitle` | `items` 来自 |
|---|---|---|---|
| `Education` | `school` | `major` | `highlights` |
| `WorkExperience` | `company` | `position` | `[...responsibilities, ...achievements]` |
| `Project` | `name` | — | `[...responsibilities, ...achievements]` |
| `PortfolioProject` | `name` | — | `highlights` |

- `period` / `location` / `description` 同名直取
- `Project` / `PortfolioProject` 额外映射 `tags` / `techStack` / `url`
- 要点合并顺序固定「职责在前、业绩在后」，与当前模板行为一致

### 4.4 删除 `PortfolioProject.status`

字段无实际用途。作品集若无上线时间，`period` 留空即可，时间位置不渲染。

### 4.5 关于后续扩展字段

你提到工作经历 / 项目经历「内容偏少，以后大概率要扩展」。当前 `SectionItem` 的字段
（`title` / `subtitle` / `period` / `location` / `description` / `tags` / `techStack` / `url` / `items`）
能覆盖：

| 想加的内容 | 放法 |
|---|---|
| 工作经历的「部门」「团队规模」 | 拼进 `subtitle`（如「前端开发工程师 · 广告业务部」） |
| 项目经历的「角色」 | `subtitle` |
| 教育背景的「GPA」「主修课程」 | `items` 里加一条 |
| 更多自定义分组 | 将来加可选 `groups` 字段 |

**所有扩展字段都是可选的**，加字段不会破坏已有数据。

---

## 5. 数据层转换

### 5.1 位置

新建 `src/data/toSectionItem.ts`。

**为什么不放 `src/utils/`**：转换函数依赖 `@/types` 的简历领域类型，属于「数据语义」而非「通用纯函数」。

### 5.2 函数签名

```ts
export function educationToItems(list: Education[]): SectionItem[]
export function workToItems(list: WorkExperience[]): SectionItem[]
export function projectToItems(list: Project[]): SectionItem[]
export function portfolioToItems(list: PortfolioProject[]): SectionItem[]
```

四个独立函数，不做泛型工厂——四种映射逻辑各不相同，配置对象比四个 5 行函数更绕。

### 5.3 使用方式

在 `ClassicDocument.vue` 的 `<script setup>` 顶层直接调用（数据是构建期常量，不用 `computed`）：

```ts
import {
  educationToItems,
  workToItems,
  projectToItems,
  portfolioToItems,
} from '@/data/toSectionItem'

const { personalInfo, advantages, education, workExperience, projects, portfolio, languages } =
  resumeData

const educationItems = educationToItems(education)
const workItems = workToItems(workExperience)
const projectItems = projectToItems(projects)
const portfolioItems = portfolioToItems(portfolio)
```

### 5.4 为什么不改原始数据结构

`ResumeData` 里的四种结构**保持原样，一个字段都不改名**：

1. 原始字段名有语义（`company` 比 `title` 更明确）
2. `default` 模板也读 `resumeData`，改名会连带破坏
3. 转换层在消费侧，随时可撤

---

## 6. 组件设计

### 6.1 组件清单

| 组件 | 位置 | 职责 |
|---|---|---|
| `Profile.vue` | `blocks/` | 个人信息区（头像 + 姓名 + 岗位 + 联系方式） |
| `SectionItem.vue` | `blocks/` | 版块内的一个条目 |
| `SectionItemHead.vue` | `blocks/` | 条目头部（合并原 `EntryHead` + `ProjectHead`） |
| `Bullet.vue` | `blocks/` | 单条要点（保留） |
| ~~`SectionTitle.vue`~~ | — | **删除**，改为直接写 `<h2 class="section-title">` |
| ~~`ProjectHead.vue`~~ | — | **删除**，能力合并进 `SectionItemHead` |
| ~~`ProfileHeader.vue`~~ | — | **改名**为 `Profile.vue` |

### 6.2 `SectionItemHead.vue`（合并两个头部组件）

**统一 props：**

| prop | 类型 | 说明 |
|---|---|---|
| `title` | `string` | 主标题 |
| `subtitle?` | `string` | 副标题 |
| `period?` | `string` | 时间 |
| `location?` | `string` | 地点 |
| `url?` | `string` | 有值时主标题渲染为 `<a>` |
| `tags?` | `string[]` | 标签 |
| `techStack?` | `string[]` | 技术栈，与 `tags` 合并成第二行 |

**内部派生：**

```ts
const metaText = [props.period, props.location].filter(Boolean).join(' · ')  // 右侧
const tagLine = [...(props.tags ?? []), ...(props.techStack ?? [])].join(' / ')  // 第二行
```

**模板：**

```vue
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  subtitle?: string
  period?: string
  location?: string
  url?: string
  tags?: string[]
  techStack?: string[]
}>()

const metaText = computed(() => [props.period, props.location].filter(Boolean).join(' · '))
const tagLine = computed(() => [...(props.tags ?? []), ...(props.techStack ?? [])].join(' / '))
</script>

<template>
  <div class="flex flex-col print:break-after-avoid print:break-inside-avoid">
    <div class="flex items-baseline justify-between gap-4">
      <div class="min-w-0">
        <component
          :is="url ? 'a' : 'span'"
          :href="url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-bold text-ink no-underline"
        >
          {{ title }}
        </component>
        <span v-if="subtitle" class="ml-2 text-xs font-medium text-ink-muted">{{ subtitle }}</span>
      </div>
      <span v-if="metaText" class="flex-none text-xs text-ink-faint">{{ metaText }}</span>
    </div>
    <p v-if="tagLine" class="mt-px text-[10px] leading-[15px] text-ink-hint break-anywhere">
      {{ tagLine }}
    </p>
  </div>
</template>
```

### 6.3 `SectionItem.vue`

| 项 | 内容 |
|---|---|
| props | `item: SectionItem` |
| emits | 无 |
| 状态 | 无 |
| 样式 | 无 `<style>` 块 |

```vue
<script setup lang="ts">
import type { SectionItem } from '@/types'
import SectionItemHead from './SectionItemHead.vue'
import Bullet from './Bullet.vue'

defineProps<{ item: SectionItem }>()
</script>

<template>
  <div class="section-item-block">
    <SectionItemHead
      :title="item.title"
      :subtitle="item.subtitle"
      :period="item.period"
      :location="item.location"
      :url="item.url"
      :tags="item.tags"
      :tech-stack="item.techStack"
    />

    <p v-if="item.description" class="bullet mt-1">{{ item.description }}</p>

    <ul v-if="item.items.length" class="mt-1 space-y-1">
      <Bullet v-for="(text, index) in item.items" :key="index" :text="text" />
    </ul>
  </div>
</template>
```

### 6.4 `Profile.vue`（原 `ProfileHeader.vue`）

**改三处：**

1. 文件名 `ProfileHeader.vue` → `Profile.vue`
2. 根节点 `<header class="profile-grid">` → `<div class="grid grid-cols-[112px_minmax(0,1fr)] gap-6 items-stretch pb-3 border-b border-ink">`
3. 组件内部的单点样式改为 `<style scoped>` + `--at-apply`（见 7.3）

**根节点改为 `<div>` 的理由**：组件内部不应该假设自己被放在页眉位置。
`<header>` 语义由**父组件**（`ClassicDocument.vue`）提供：

```vue
<A4>
  <header>
    <Profile :info="personalInfo" />
  </header>
  ...
</A4>
```

其余（头像、左右 grid、联系方式栅格）完全不变。

### 6.5 `Bullet.vue` 保留

`bullet` shortcut 是 7 个 class 的固定组合（含 `::before` 方点的 6 个属性），模板里出现 5 次。
封装成组件后改样式只需改 shortcut 一处，且 `<li>` 根节点强制了列表语义。

### 6.6 `SectionTitle.vue` 删除

其模板就是 `<h2 class="section-title">{{ text }}</h2>`，`section-title` 已是 uno shortcut，
组件只剩一层转发。删除后版块标题直接写：

```vue
<h2 class="section-title">工作经历</h2>
```

`section-title` shortcut **保留**：若删掉它，每个版块要写 8 个 class。

---

## 7. 样式表达原则与 shortcut 审计

### 7.1 判断标准

**只有「大量复用」或「新建模板一定会用」的样式才提炼为 shortcut。**

单个组件内部只出现一次（或只在同一组件内复用）的样式，用两种方式表达：

| 场景 | 写法 |
|---|---|
| 组件内**复用**同一组工具类 | `<style scoped>` 里 `--at-apply` |
| 组件内**只用一次** | 模板里直接写工具类 |

`--at-apply` 已通过 `transformerDirectives` 接入（`uno.config.ts` 的 `transformers`）。
它把工具类编译成真实 CSS 并保留 scoped 属性选择器，实测输出：

```css
.title[data-v-95c502a8] { font-size:0.75rem;line-height:1rem;font-weight:700;color:#111827 }
```

### 7.2 现有 shortcut 审计结果

| shortcut | 现状使用 | 判定 |
|---|---|---|
| `a4-sheet` | 每张纸 | ✅ 保留（新模板必用） |
| `section-title` | 5 个版块 | ✅ 保留（大量复用） |
| `section-block` | 5 个版块 | ✅ 保留（大量复用） |
| `section-item-block` | 每条目 | ✅ 保留（大量复用） |
| `bullet` | 400+ 条要点 | ✅ 保留（大量复用） |
| `resume-grid-sheet` | 仅 default 模板 | ⚠️ 保留至 default 删除 |
| `entry-block` | 4 次 | ❌ 改名并合并为 `section-item-block` |
| `entry-row` | 1 次 | ❌ 删除 |
| `entry-title` | 1 次 | ❌ 删除 |
| `entry-sub` | 1 次 | ❌ 删除 |
| `entry-meta` | 1 次 | ❌ 删除 |
| `project-tags` | 1 次 | ❌ 删除 |
| `profile-grid` | 1 次 | ❌ 删除 |
| `profile-identity` | 1 次 | ❌ 删除 |
| `profile-name` | 1 次 | ❌ 删除 |
| `profile-role` | 1 次 | ❌ 删除 |
| `profile-avatar` | 1 次 | ❌ 删除 |
| `profile-avatar-fallback` | 1 次 | ❌ 删除 |
| `profile-meta` | 1 次 | ❌ 删除 |
| `contact-row` | 1 次 | ❌ 删除 |
| `contact-label` | 1 次 | ❌ 删除 |
| `contact-value` | 1 次 | ❌ 删除 |

**删除 15 个，保留 5 个**（含 `resume-grid-sheet` 待定）。

### 7.3 删除后各组件如何表达样式

**`SectionItemHead.vue`（4 个单点类 → `--at-apply` 或直接工具类）**

```vue
<template>
  <div class="flex flex-col print:break-after-avoid print:break-inside-avoid">
    <div class="flex items-baseline justify-between gap-4">
      <div class="min-w-0">
        <component :is="url ? 'a' : 'span'" :href="url" class="text-xs font-bold text-ink no-underline">
          {{ title }}
        </component>
        <span v-if="subtitle" class="ml-2 text-xs font-medium text-ink-muted">{{ subtitle }}</span>
      </div>
      <span v-if="metaText" class="flex-none text-xs text-ink-faint">{{ metaText }}</span>
    </div>
    <p v-if="tagLine" class="mt-px text-[10px] leading-[15px] text-ink-hint break-anywhere">
      {{ tagLine }}
    </p>
  </div>
</template>
```

全部是预设工具类 + 已有的 `ink-*` 颜色键，**无需 shortcut，无需 `<style>`**。

**`Profile.vue`（9 个单点类 → 直接工具类）**

`profile-grid` 的两栏布局直接写在模板上：

```vue
<div class="grid grid-cols-[112px_minmax(0,1fr)] gap-6 items-stretch pb-3 border-b border-ink">
```

组件内**复用**的部分（联系方式行）用 `--at-apply`：

```vue
<style scoped>
.contact-row {
  --at-apply: 'flex items-baseline gap-2 py-[3px] text-[11px] leading-4 border-b border-dotted border-rule-dotted';
}
.contact-label { --at-apply: 'w-12 flex-none text-ink-hint'; }
.contact-value { --at-apply: 'min-w-0 text-ink-deep break-anywhere'; }
</style>
```

### 7.4 保留的 shortcut 汇总

```
纸张
  a4-sheet              一张 A4（新模板必用）
  resume-grid-sheet     default 模板单页骨架（随 default 删除）

版块
  section-title         版块标题 <h2>（5 处复用）
  section-block         版块容器（5 处复用）

条目
  section-item-block    条目容器（每个条目复用）

内容
  bullet                单条要点（400+ 次复用，含 ::before 方点）
```

### 7.5 新增依赖

`uno.config.ts` 增加一行：

```ts
import { defineConfig, presetWind3, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [presetWind3()],
  transformers: [transformerDirectives()],
  ...
})
```

`@unocss/transformer-directives` 随 `unocss` 已安装（66.12.0），无需单独装。

## 8. 改造后的版块写法

### 8.1 条目间距统一为 `mt-3`

现有写法 `['entry-block', index === 0 ? 'mt-2' : 'mt-3']` 是早期随手写的，
首项与后续差 4px，肉眼不可辨。**统一为 `mt-3`**，删除 `index === 0` 判断。

> 影响：每个版块首项增加 4px，四个版块合计约 +16px，需在实施后验证分页高度。

### 8.2 工作经历

```vue
<section v-if="workItems.length" class="section-block">
  <h2 class="section-title">工作经历</h2>
  <SectionItem v-for="item in workItems" :key="item.title" :item="item" class="mt-3" />
</section>
```

### 8.3 项目经历

```vue
<section v-if="projectItems.length" class="section-block">
  <h2 class="section-title">项目经历</h2>
  <SectionItem v-for="item in projectItems" :key="item.title" :item="item" class="mt-3" />
</section>
```

### 8.4 作品集

```vue
<section v-if="portfolioItems.length" class="section-block">
  <h2 class="section-title">作品集</h2>
  <SectionItem v-for="item in portfolioItems" :key="item.title" :item="item" class="mt-3" />
</section>
```

### 8.5 教育背景（语言能力留在版块内）

```vue
<section v-if="educationItems.length" class="section-block">
  <h2 class="section-title">教育背景</h2>
  <SectionItem v-for="item in educationItems" :key="item.title" :item="item" class="mt-3" />
  <p
    v-for="(item, index) in languages"
    :key="index"
    class="mt-1 text-xs leading-relaxed text-gray-700"
  >
    <span class="font-bold text-gray-900">{{ item.name }}（{{ item.level }}）</span>
    <span v-if="item.description">：{{ item.description }}</span>
  </p>
</section>
```

### 8.6 个人优势（不套 `SectionItem`）

```vue
<section v-if="advantages.length" class="section-block">
  <h2 class="section-title">个人优势</h2>
  <ul class="mt-2 space-y-1">
    <Bullet v-for="(text, index) in advantages" :key="index" :text="text" />
  </ul>
</section>
```

### 8.7 第 1 页页眉

```vue
<A4>
  <header>
    <Profile :info="personalInfo" />
  </header>
  ...
</A4>
```

---

## 9. 改动清单

| 动作 | 文件 | 说明 |
|---|---|---|
| 修改 | `src/types/resume.ts` | 新增 `SectionItem`；`PortfolioProject` 删除 `status` |
| 新增 | `src/data/toSectionItem.ts` | 四个转换函数 |
| 新增 | `src/templates/classic/blocks/SectionItem.vue` | 条目组件 |
| 新增 | `src/templates/classic/blocks/SectionItemHead.vue` | 条目头（合并两个旧组件） |
| 修改 | `src/templates/classic/blocks/ProfileHeader.vue` → `Profile.vue` | 改名 + 根节点 `<header>` → `<div>` |
| 删除 | `src/templates/classic/blocks/ProjectHead.vue` | 合并进 `SectionItemHead` |
| 删除 | `src/templates/classic/blocks/EntryHead.vue` | 合并进 `SectionItemHead` |
| 删除 | `src/templates/classic/blocks/SectionTitle.vue` | 纯透传，改 `<h2>` |
| 修改 | `src/templates/classic/ClassicDocument.vue` | 五个版块改写；删两处 `[...a, ...b]`；加 `<header>` |
| 修改 | `uno.config.ts` | 接入 `transformerDirectives`；删除 15 个单点 shortcut；`entry-block` → `section-item-block` |
| 修改 | `src/mydata/portfolio.ts` | 删除 `status` 字段 |
| 不改 | `blocks/Bullet.vue` | 保留 |
| 不改 | `src/components/page/*`（default 模板） | 仍读原始结构 |

### 9.1 预计行数

| 文件 | 现状 | 改动后 |
|---|---|---|
| `ClassicDocument.vue` | 162 行 | 约 80 行 |
| `SectionItem.vue` | — | 约 30 行 |
| `SectionItemHead.vue` | — | 约 40 行 |
| `toSectionItem.ts` | — | 约 45 行 |
| `EntryHead.vue` + `ProjectHead.vue` | 27 + 35 行 | 删除（合并为 40 行） |
| `SectionTitle.vue` | 13 行 | 删除 |

---

## 10. 不变式（改动后必须成立）

| # | 不变式 |
|---|---|
| 1 | 打印仍为 3 页，每页版块分配不变 |
| 2 | 三个 `<A4>` 仍手写，分页位置不变 |
| 3 | 五个版块标题文案与顺序不变 |
| 4 | 教育背景末尾仍追加语言能力 |
| 5 | 个人优势仍无条目头，直接渲染 bullet |
| 6 | 作品集项目名带 GitHub 链接（`url` 有值时渲染 `<a>`） |
| 7 | 第 1 页个人信息区仍在 `<header>` 语义内 |
| 8 | `default` 模板行为完全不变 |
| 9 | `vue-tsc -b` 与 `npm run build` 通过 |
| 10 | 每页 `scrollHeight - clientHeight` 为 0 |

---

## 11. 未决事项

1. **`description` 的方点**：项目 / 作品集的概述段落当前复用 `bullet` 类，
   带一个 `::before` 方点（视觉上像带符号的段落）。这是既有行为，本次不改；
   如需去掉方点，另开一次视觉调整。

2. **`project-tags` 是否也改名为 `section-item-tags`**：当前保留原名，
   若追求命名族完全统一可改。

3. **`mt-3` 统一后的分页验证**：四个版块首项各 +4px，合计约 +16px。
   第 1 页当前已用 534/1032，第 2 页 854/1032，第 3 页 601/1032，
   理论上有余量，需实测确认无溢出。

4. **`:key="item.title"` 的唯一性**：若将来出现同名条目（两段经历在同一公司），
   需要给 `SectionItem` 加 `id` 字段。
