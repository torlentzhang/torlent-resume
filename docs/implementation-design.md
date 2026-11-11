# 简历流式模板 + UnoCSS 实现设计

> 定位：`docs/architecture-design.md` 讲「为什么这样做」，本文讲「照着怎么写」。
> 状态：**实现已回退**。当前仓库只有一个单页 `classic` 模板；流式分页与 UnoCSS 迁移都是**待实施**的设计。
> 文中 `[已存在]` 标注回退后保留的基础设施，`[待做]` 标注尚未落地、等确认后按 §10 开工的部分。

---

## 0. 当前状态快照

### 0.1 已保留（回退边界内保留）

| 项 | 状态 |
|---|---|
| 路由 | `src/router/` + `src/pages/index.vue` + `App.vue` 的 `<RouterView />` 壳 |
| 纸张 | `src/components/A4.vue`（纯容器，仅尺寸/内边距/白底/裁切） |
| 样式 | `src/style/style.scss` + Sass，`.vscode/settings.json` 的 lint 配置 |
| 模板机制 | `registry.ts` + `default` 静态三页 + `classic` 单页 + 切换器 |
| 类型 | 已迁到 `src/types/`（`index.ts` 统一出口，`resume.ts` / `template.ts`） |
| 包管理 | npm，`package-lock.json` |
| 文档 | `docs/architecture-design.md`、`docs/implementation-design.md` |

### 0.2 已回退（本次移除）

- `src/resume/`（`types.ts` / `metrics.ts` / `paginate.ts`）
- `src/components/resume/`（含页层 `ResumePage.vue`）
- `classic` 的流式实现：`ClassicFlow.vue`、`build.ts`、`blocks/*`
- 数据层：`ResumeData.personalProjects`、`hasRealData` 必选白名单
- `unocss` 依赖（已从 `package.json` 移除）

`classic` 现为**单页**版式：姓名 + 职位抬头、联系方式一行、个人优势、工作经历、教育背景、专业技能、语言能力，黑白灰单栏，内容包在 `A4` 里。语言能力恢复为独立版块。

### 0.3 当前目录约定（硬约定）

1. 类型只在 `src/types/` 定义，按领域拆文件，业务代码只从 `@/types` 引用。
2. 纯函数只在 `src/utils/`，同样 `index.ts` 统一出口；组件内不写可复用计算。
3. 不再出现 `src/type/types.ts`、`src/templates/types.ts` 这类分散的类型文件。
4. 包管理器统一 npm：`npm install` / `npm run dev` / `npm run build`。

---

## 1. 文件树（目标态）

```
src/
├── main.ts                              # [已存在] 挂 router + 全局样式
├── App.vue                              # [已存在] 仅 <RouterView />
├── router/index.ts                      # [已存在] hash 模式，/ → pages/index.vue
├── pages/index.vue                      # [已存在] 控制器：模板切换 + 打印导出
├── types/                               # [已存在] 类型统一出口
│   ├── index.ts                         #   export * from './resume' / './template' / './flow'
│   ├── resume.ts                        #   ResumeData / PersonalInfo / Education / …
│   ├── template.ts                      #   ResumeTemplate（pages | flow）
│   └── flow.ts                          #   [待做] Block / PageBlock / ResumePageModel
├── utils/                               # [待做] 纯函数统一出口
│   ├── index.ts                         #   export * from './metrics' / './paginate'
│   ├── metrics.ts                       #   估算参数（唯一调参处）+ 文本行数
│   └── paginate.ts                      #   装箱分页（纯函数）
├── data/index.ts                        # [已存在] 真实数据优先，否则演示数据
├── mydata/index.ts                      # [已存在] glob 收集本地私有数据
├── style/style.scss                     # [已存在] Tailwind 入口，[待改] 换 UnoCSS reset
├── components/
│   ├── A4.vue                           # [已存在] 一张纸：尺寸/内边距/白底/裁切/分页断开
│   ├── page/ResumeSheet.vue             # [已存在] default 模板的单页壳，[待改] 去 :deep()
│   ├── section/*.vue                    # [已存在] default 模板的版块（Tailwind 类名）
│   └── BlockRenderer.vue                # [待做] 块渲染 + 间距（不是页层）
└── templates/
    ├── registry.ts                      # [已存在] glob 自动注册
    ├── default/index.ts                 # [已存在] 静态三页
    └── classic/
        ├── index.ts                     # [已存在] 当前 pages: [page-1]
        ├── pages/page-1.vue             # [已存在] 单页黑白灰（含专业技能、语言）
        ├── ClassicFlow.vue              # [待做] 建模→分页→v-for 渲染多个 A4
        ├── build.ts                     # [待做] resumeData → Block[]
        └── blocks/                      # [待做]
            ├── ProfileHeader.vue
            ├── SectionTitle.vue
            ├── Bullet.vue
            ├── EntryHead.vue
            └── ProjectHead.vue

uno.config.ts                            # [待做] 唯一新增的配置文件
```

### 1.1 每个新文件的职责与导出

| 文件 | 导出 | 职责 |
|---|---|---|
| `src/types/index.ts` | `export *` | 类型唯一入口，业务代码只从 `@/types` 引用 |
| `src/types/resume.ts` | `ResumeData`、`PersonalInfo` 等 | 领域数据类型，无运行时代码 |
| `src/types/template.ts` | `ResumeTemplate` | 模板描述（`pages` 静态 / `flow` 流式） |
| `src/types/flow.ts` `[待做]` | `Block`、`PageBlock`、`ResumePageModel` | 流式分页类型 |
| `src/utils/index.ts` `[待做]` | `export *` | 纯函数唯一入口 |
| `src/utils/metrics.ts` `[待做]` | 常量 + `textLines()`、`bulletLines()` | 行数估算；全文唯一调参处 |
| `src/utils/paginate.ts` `[待做]` | `paginate(blocks, maxLines)` | 纯函数装箱，返回页模型数组 |
| `src/templates/classic/build.ts` `[待做]` | `buildBlocks(data)` | 把 `ResumeData` 展开为扁平 `Block[]`，决定版块顺序与每块估行 |
| `src/templates/classic/ClassicFlow.vue` `[待做]` | 默认导出组件 | 读 `resumeData`，`computed` 出 `pages`，`v-for` 平铺多个 `<A4>` |
| `src/templates/classic/index.ts` | `default: ResumeTemplate` | 当前 `{ id: 'classic', name: '经典单栏', pages: [page-1] }`；流式落地后改为 `flow` |
| `src/components/BlockRenderer.vue` `[待做]` | 默认导出组件 | `<component :is>` + 按 `gapBefore` 折算 margin-top |
| `uno.config.ts` `[待做]` | `default defineConfig(...)` | theme / shortcuts / rules / presets |

约定：`build.ts` 是唯一「知道简历语义」的模板层文件；`paginate.ts` 只认行数，不认版块。

### 1.2 分层与职责边界

```
ClassicFlow.vue        模板层：决定顺序、算页数、v-for 出多张纸
  └── A4.vue           纸张层：尺寸、内边距、白底、裁切、纸与纸的分页断开
        └── BlockRenderer.vue × N   版块层：纯展示 + 块间距
```

- **没有页组件层**：每一页就是 `<A4> ...该页内容... </A4>`，不再包 `<div class="page">`。
- `A4` 承担打印分页：`@media print { .a4-sheet:not(:last-child) { break-after: page } }`。
  末页自动取消，无需 `:last-child` 单独写，也无需任何 wrapper 管 `break-after`。
- `A4` **不做**：溢出测量、行数估算、数据读取、业务判断。
- 不做任何溢出测量或断言：`A4` 有 `overflow: hidden`，测量只能在裁切之后报告，不改变结果。

---

## 2. 核心数据结构

### 2.1 `Block`（建模产物，分页输入）

| 字段 | 类型 | 含义 |
|---|---|---|
| `id` | `string` | 全局唯一，用作渲染 key；命名 `<section>:<index>:<kind>` |
| `component` | `Component` | 该块对应的 Vue 组件（块级组件，非页面） |
| `props` | `Record<string, unknown>` | 透传给 `component` 的 props |
| `lines` | `number` | **估算**高度，单位「行」，可为小数 |
| `gapBefore` | `number?` | 与上一块的间距，单位「行」；页首强制归零 |
| `keepWithNext` | `boolean?` | 标题类块，不允许成为页尾最后一块 |
| `groupId` | `string?` | 所属组（一个项目/一段经历），用于续页头判断 |
| `groupHead` | `boolean?` | 是否为该组的头块 |
| `continuation` | `object?` | 跨页时插入的续页头：`{ component, props, lines }` |

### 2.2 `PageBlock`（分页产物，渲染输入）

在 `Block` 基础上裁剪：去掉 `continuation` / `keepWithNext` / `groupHead`，
新增 `key: string`（可能带 `:continuation` 后缀）、`isContinuation?: boolean`。
`gapBefore` 变为**必填**（页首已归一为 0）。

### 2.3 `ResumePageModel`

`{ index: number; blocks: PageBlock[]; filledLines: number }`。
`filledLines` 只用于调试与孤行调整，不参与渲染。
一个 `ResumePageModel` 最终渲染成一张 `<A4>`。

### 2.4 `ResumeTemplate`

| 字段 | 类型 | 含义 |
|---|---|---|
| `id` | `string` | 路由/选择器用的稳定标识 |
| `name` | `string` | 下拉展示名 |
| `description` | `string?` | 备注，当前未展示 |
| `pages` | `Component[]?` | **静态模板**：一个元素 = 一张纸，顺序即页序 |
| `flow` | `Component?` | **流式模板**：页数由组件内部计算 |

`pages` 与 `flow` 二选一；`pages/index.vue` 优先 `flow`。

---

## 3. 行数估算规则

### 3.1 唯一一套尺寸数值

纸张尺寸只在 `uno.config.ts` 的 `A4` 常量里出现一次。内容盒由它推出，**不另立第二套**：

```
纸张：210mm × 297mm，内边距 12mm 16mm
内容盒宽 = 210mm − 16mm×2 = 178mm ≈ 672.75px
内容盒高 = 297mm − 12mm×2 = 273mm ≈ 1031.8px
```

`metrics.ts` 只写内容盒的两个结果值，并在注释里标推导来源：

| 参数 | 值 | 推导 |
|---|---|---|
| `CONTENT_WIDTH` | `672.75` px | `A4.width − padding.x×2` |
| `PAGE_CONTENT_HEIGHT` | `1031.8` px | `A4.height − padding.y×2` |
| `LINE_HEIGHT` | `22` px | 正文 12px × 1.8 = 21.6，取整 |
| `SAFETY_FACTOR` | `1.05` | 保守系数，估算整体放大 5% |
| `MAX_LINES_PER_PAGE` | `44` | `floor(1031.8 / 22 / 1.05)` |
| `CHARS_PER_LINE` | `52` | `floor(672.75 / 12) = 56`，再留约 7% 余量取 52 |

双保险：实际每行 21.6px，44 行只占 950.4px，本身还有约 81px（7.9%）余量；
再叠加 5% 保守系数，合计约 12% 宽松度。

### 3.2 文本行数公式

```
权重：/[\x00-\xff]/ 命中记 0.5（半角），否则记 1（全角/中文）
行数：max(1, ceil(权重和 / CHARS_PER_LINE))
```

一条 bullet 的 `lines` = 文本行数。

> 块间距**一律走 `gapBefore`，不折进 `lines`**。主循环按 `need = gap + block.lines` 累加，
> 若把 0.2 也写进 `lines`，同一段间距会被计两次；约 30 条 bullet 就是白丢 6 行，
> 接近一整页的 14%。`BLOCK_GAP.bullet` 全项目只出现在 `gapBefore` 一处。

### 3.3 块行数表

| 块 | `lines` | 实际高度参考 | 说明 |
|---|---|---|---|
| 个人信息 | `6` | ≈ 124px | 固定值，按左侧头像栏 112 + 底边 12 估 |
| 版块标题 | `1` | 22px | 12/16 + 5px padding + 1px 边线 ≈ 22 |
| 条目头（教育/工作） | `0.9` | 18px | 单行 12/18，留 4px 误差 |
| 项目头 | `1.7` | 18 + 1 + 15 ≈ 34px | 两行：名称行 + 标签行 |
| 项目续页头 | `1` | 18px + 2px padding + 边线 | 只有一行「（续）」 |
| bullet | `ceil(字符权重和 / CHARS_PER_LINE)` | 21.6px/行 | 逐条计算；**不含间距**，间距由 `gapBefore` 给 |

### 3.4 间距（`BLOCK_GAP`，单位「行」）

| 场景 | 值 | 折算 px |
|---|---|---|
| 版块之间（标题的 `gapBefore`） | `1.2` | 26.4 |
| 条目之间（条目头 / 项目头的 `gapBefore`） | `0.6` | 13.2 |
| bullet 之间 | `0.2` | 4.4 |

页首块的 `gapBefore` 在分页阶段被强制归零，不占行。

---

## 4. 分页函数

### 4.1 签名

```ts
function paginate(blocks: Block[], maxLines: number): ResumePageModel[]
```

- 输入：已按阅读顺序排好的扁平块序列 + 每页可用行数（默认传 `MAX_LINES_PER_PAGE`）。
- 输出：至少 1 页；每页 `blocks` 顺序不变（除插入的续页头）。
- 纯函数：不读 DOM、不读全局状态、无副作用（只有一条 `console.warn` 兜底）。

### 4.2 主循环伪代码

```
pages = [空页]
continuations = Map<groupId, continuation>   # 预扫描所有组头，bullet 也能查到
used = 0; cursor = 0

while cursor < blocks.length:
  block = blocks[cursor]; page = 当前页
  gap = (page 为空 ? 0 : block.gapBefore ?? 0)

  # 续页头：本页还没有这个组
  needCont = block.groupId 存在 && !block.groupHead
             && continuations 有该组
             && page 中没有任何该组的块

  need = gap + block.lines
  if needCont: need += BLOCK_GAP.entry + continuation.lines

  # 标题孤行：标题和下一块一起判断容量
  if block.keepWithNext && 存在下一块:
    need += (next.gapBefore ?? 0) + next.lines

  if used + need > maxLines && page 非空:
    新开一页; used = 0
    continue                        # 不推进 cursor，同一块在新页重试

  if used + need > maxLines && page 为空:
    warn(`块 ${block.id} 估算高度超过单页 ${maxLines} 行`)   # 兜底，防死循环

  if needCont:
    压入续页头 PageBlock(key = `${block.id}:continuation`, gapBefore = 0.6, isContinuation)
    used += 0.6 + continuation.lines

  压入 block 对应的 PageBlock(gapBefore = gap)
  used += gap + block.lines
  page.filledLines = used
  cursor += 1

applyWidowGuard(pages, maxLines)
applyTailGuard(pages, maxLines)     # 见 4.3 第三条，当前未实现
return pages
```

### 4.3 三条守卫

**① 标题孤行（已实现，`keepWithNext`）**
标题块参与容量计算时，把下一块的 `gap + lines` 一并计入 `need`。放不下就整组换页，
避免「版块标题落在页尾、内容在下一页」。

**② 续页孤行（已实现，`applyWidowGuard`）**
逐页检查：若下一页某组只剩 1 条非续页头块，且上一页该组仍 ≥ 2 条，则把上一页该组
最后一条搬到下一页开头，并把它的 `gapBefore` 改为 `BLOCK_GAP.bullet`。
前提是下一页 `filledLines + moved.gapBefore + moved.lines <= maxLines`，否则放弃
（宁可孤行也不溢出）。注意容量项里**只有 `gapBefore`**，`lines` 里不再含间距。

**③ 页尾悬空（未实现，建议默认关闭）**
定义：某页最后只剩该组的 1 条 bullet，而该组在下一页还有 ≥ 2 条——页尾挂着一条
「没头没尾」的孤立 bullet。处理：

```
for i in 0 .. pages.length - 2:
  if 第 i 页最后一组块数 == 1 && 不是组头
     && 第 i+1 页同组非续页头块数 >= 2
     && 第 i+1 页该组第一条移走后仍 >= 2:
        if 第 i 页 filledLines + moved.gapBefore + moved.lines <= maxLines:
          搬上来
```

与 ② 的方向相反，二者会互相拉扯，因此规则是：**先跑 ②，再跑 ③；③ 必须保证搬完后
下一页该组仍 ≥ 2 条**，否则跳过。当前未启用，原因是实测 3 页里没有出现该形态，
且额外逻辑会增加不可预测性。

### 4.4 复杂度

`O(n)` 主循环 + `O(pages × blocksPerPage)` 守卫，简历量级下可忽略。

---

## 5. 组件契约

所有组件均**无 emits**。

| 组件 | props | slots | 内部状态 | 数据来源 |
|---|---|---|---|---|
| `A4.vue` | `padding?: boolean = true` | 默认 | 无 | 父级直接写入该页内容 |
| `BlockRenderer.vue` | `block: PageBlock` | 无 | `computed marginTop` | 父级传 `PageBlock` |
| `ProfileHeader.vue` | `info: PersonalInfo` | 无 | `avatarBroken`、`computed showAvatar / metaRows` | `build.ts` 塞 `props.info` |
| `SectionTitle.vue` | `text: string` | 无 | 无 | `build.ts` |
| `EntryHead.vue` | `title: string`、`subtitle?`、`period?`、`location?` | 无 | 无 | `build.ts` |
| `Bullet.vue` | `text: string` | 无 | 无 | `build.ts` |
| `ProjectHead.vue` | `project: { name; period?; tags: string[]; techStack: string[] }`、`continuation?: boolean = false` | 无 | `computed tags` | `build.ts` |
| `ClassicFlow.vue` | 无 | 无 | `computed pages` | 直接 `import { resumeData }` |
| `pages/index.vue` | 无（路由页） | 无 | `activeTemplateId`、`computed activeTemplate`、`isExporting` | 读注册表 |

### 5.1 继承式约定

1. 版块组件只收 props，**不读 `resumeData`**；唯一读数据的是 `ClassicFlow.vue`。
2. 版块组件根节点**不带纵向 margin**，间距统一由 `BlockRenderer` 的 `marginTop` 给。
3. 版块组件根节点不得设置 `position: fixed/absolute`，否则脱离行数流。
4. 版块组件的实际高度必须 ≤ 其 `lines × 22px`（估算的前提，自行控制）。
5. **不得再引入页层组件**：`v-for` 直接出 `<A4>`，页与页之间只有 `gap`（屏幕）和
   `break-after`（打印），不靠 wrapper。

### 5.2 `A4.vue` 契约细节

| 项 | 说明 |
|---|---|
| 尺寸 | `w-a4 h-a4 p-a4 box-border overflow-hidden bg-paper`（shortcut `a4-sheet`） |
| 屏幕 | `shadow-paper`（`0 12px 32px rgba(0,0,0,.12)`） |
| 打印 | `break-inside: avoid`；`.a4-sheet:not(:last-child) { break-after: page }`；`box-shadow:none`；`margin:0` |
| `padding=false` | 加 `p-0`，用于需要整版出血的场景（当前未用到） |
| 禁止 | 溢出测量、读数据、`ResizeObserver`、业务判断 |

### 5.3 不做渲染期断言

本项目**不在组件内写任何 `scrollHeight` / `ResizeObserver` / 红框 / `console.warn` 断言**
（`ResumeSheet.vue` 里既有的那套保持原样不动，它属于 `default` 模板的旧路径）。

原因：`A4` 带 `overflow: hidden`，任何测量都只是在「已经裁掉之后」报告，不改变结果；
而估算是否准确，用浏览器实际打印一眼就能看出来。这类断言属于测试手段，本项目由人工验收
替代，不写进代码。

因此 `ClassicFlow.vue` 只做三件事：读数据 → 建模分页 → `v-for` 渲染 `<A4>`。

---

## 6. 版块排版规格

单位 px；「间距」未特别说明时由 `BlockRenderer` 统一给。

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
| 项目名 | 12/18 | 700 | `#111` | — |
| 项目时间 | 10.5/16 | 400 | `#777` | `flex:none` |
| 项目标签/技术栈 | 10/15 | 400 | `#888` | `margin-top:1px`，`overflow-wrap:anywhere`，`/` 连接 |
| 项目续页头 | 12/18 | 700 | `#555` | `border-bottom:1px dotted #d4d4d4`，`padding-bottom:2px` |
| 块间距 | — | — | — | 版块 26.4 / 条目 13.2 / bullet 4.4 |
| 纸张 | — | — | 白底 | 210×297mm，内边距 `12mm 16mm`，`box-sizing:border-box`，`overflow:hidden` |
| 纸张投影（屏幕） | — | — | — | `0 12px 32px rgba(0,0,0,.12)`；打印时去掉 |

---

## 7. UnoCSS 设计

### 7.1 依赖与接入

| 项 | 做法 |
|---|---|
| 依赖 | 计划安装 `unocss`；移除 `tailwindcss`、`tailwind.config.js` |
| 预设 | **`presetWind3`（定案）**。理由：本项目要求迁移前后观感零差异，wind3 的默认色板、工具类语义、`space-y` 实现与 Tailwind 3 一致；wind4 走 CSS 变量层且默认色板换成 OKLCH，需要逐档手工对齐，属于纯风险。升级留到后续单独评估 |
| Vite | `vite.config.ts` 的 `plugins` 加 `UnoCSS()`，配置从根目录 `uno.config.ts` 自动读取 |
| 样式入口 | `main.ts` 按序 import：`@unocss/reset/tailwind.css` → `virtual:uno.css` → `./style/style.scss`（reset 必须最先，见下） |
| Reset | `style.scss` 删除三行 `@tailwind`；reset 放 `main.ts` 的 import 链首，**不写进 `style.scss`** |
| PostCSS | `postcss.config.js` 只留 `autoprefixer`；不接 UnoCSS 的 PostCSS 插件 |

> **import 顺序就是层叠顺序**：如果 reset 写在 `style.scss` 里、而 `virtual:uno.css` 在它之前
> 引入，reset 就会排在工具类之后。现在能正常显示，靠的是「元素选择器打不过类选择器」这个
> 特异性侥幸，而不是顺序正确。按上面的顺序写，才是意图明确。

**这是一次原子切换**：`@tailwind` 与 `tailwindcss` 插件必须同一提交内替换，中间态页面
会完全丢样式、不可运行。

### 7.2 数值唯一来源

纸张尺寸**仍然只写在 `style.scss` 的 `:root` 三个变量里**（`--a4-width/height/padding`），
`uno.config.ts` 只做映射、不复制字面量：

```ts
theme: {
  width:   { a4: 'var(--a4-width)' },
  height:  { a4: 'var(--a4-height)' },
  padding: { a4: 'var(--a4-padding)' },
}
```

这样 `A4.vue` 可以用 `a4-sheet` shortcut，`ResumeSheet.vue` 的打印规则继续用
`var(--a4-*)`，两边读的是同一个值，不存在第二套纸张尺寸。

> **不要删 `:root` 的 `--a4-*`**。`ResumeSheet.vue` 的 `@media print` 里
> `width/height/padding: var(--a4-*) !important` 是 `default` 模板三页不被内容撑高的
> 唯一保障；变量一删，`var()` 失效、属性回落到内容高度，打印直接崩版。

`@page { size: A4; margin: 0 }` 无法用工具类，保留字面量，注释写「与 `:root` 的
`--a4-*` 同步」。

内容盒宽高（`CONTENT_WIDTH` / `PAGE_CONTENT_HEIGHT`）只在 `metrics.ts` 出现，
注释标明由 `--a4-*` 减去内边距推出；**不再保留第二套纸张尺寸字面量**。

### 7.3 theme 键

| 键 | 值 | 用途 |
|---|---|---|
| `width.a4` | `210mm` | `w-a4` |
| `height.a4` | `297mm` | `h-a4` |
| `padding.a4` | `12mm 16mm` | `p-a4` |
| `colors.ink.DEFAULT` | `#111` | 姓名、标题、bullet 点 |
| `colors.ink.soft` | `#333` | 正文 |
| `colors.ink.muted` | `#555` | 副标题、续页头 |
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
| `letterSpacing.title` | `0.14em` | 版块标题 |
| `letterSpacing.name` | `0.04em` | 姓名 |
| `letterSpacing.role` | `0.06em` | 岗位 |
| `fontSize.*` | 见 7.4 | 取代 `:deep()` |

> wind3 的默认色板与 Tailwind 3 同源，`blue-*` / `gray-*` 全档位无需覆盖，
> 因此不再维护色板对照表。换 wind4 时才需要，届时单独处理。

### 7.4 字号档位（取代 `:deep()`）

`theme.fontSize` 写成 `[size, lineHeight]` 二元组。**分两组**：

**A. 旧 Tailwind 档位** —— 直接把 `ResumeSheet.vue` 里 `:deep()` 的 7 条搬进来。
覆盖后 `text-xs`~`text-3xl` 在纸内纸外天然一致，`:deep()` 整块删除。

| 类名 | size / line-height | 原来靠 |
|---|---|---|
| `text-xs` | `13px / 18px` | `:deep()` |
| `text-sm` | `16px / 23px` | `:deep()` |
| `text-base` | `18px / 26px` | `:deep()` |
| `text-lg` | `20px / 28px` | `:deep()` |
| `text-xl` | `22px / 30px` | `:deep()` |
| `text-2xl` | `26px / 34px` | `:deep()` |
| `text-3xl` | `32px / 40px` | `:deep()` |

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

> wind3 的 `theme.fontSize` 就是 Tailwind 3 的二元组形态，上表可直接照搬，
> 不需要预设可行性 spike。

### 7.5 shortcuts

| shortcut | 展开（示意） | 使用处 |
|---|---|---|
| `a4-sheet` | `w-a4 h-a4 p-a4 bg-paper overflow-hidden box-border shadow-paper print:shadow-none print:m-0` | `A4.vue` 根、`ResumeSheet.vue` 根 |
| `a4-sheet--no-padding` | `p-0` | `A4.vue` 的 `padding=false` |
| `section-title` | `pb-[5px] border-b border-rule text-section font-bold tracking-title text-ink` | `SectionTitle.vue` |
| `entry-row` | `flex items-baseline justify-between gap-4` | `EntryHead.vue` 根、`ProjectHead.vue` 名称行 |
| `entry-title` | `text-entry font-bold text-ink` | 条目头主标题 |
| `entry-sub` | `ml-2 font-medium text-ink-muted` | 条目头副标题 |
| `entry-meta` | `flex-none text-entry-meta text-ink-faint` | 条目头右侧 |
| `project-tags` | `mt-px text-tag text-ink-hint break-anywhere` | 项目标签行 |
| `project-continuation` | `pb-[2px] border-b border-dotted border-rule text-entry font-bold text-ink-muted` | 续页头 |
| `contact-row` | `flex items-baseline gap-2 py-[3px] text-contact border-b border-dotted border-rule-dotted` | `ProfileHeader.vue` 行 |
| `contact-label` | `flex-none w-12 text-ink-hint` | 联系行 `dt` |
| `contact-value` | `min-w-0 text-ink break-anywhere` | 联系行 `dd` |
| `profile-meta` | `grid grid-cols-2 gap-x-[22px] content-center` | 联系信息栅格 |
| `profile-avatar` | `w-[66px] h-[66px] rounded-full object-cover border border-rule grayscale` | 头像 |
| `bullet` | `relative pl-3 text-body text-ink-soft before:content-[''] before:absolute before:left-0 before:top-[0.72em] before:w-[3px] before:h-[3px] before:bg-ink` | `Bullet.vue` |
| `page-stack` | `flex flex-col gap-12 print:block print:gap-0 print:p-0` | `pages/index.vue` 的 `.resume-list` |

> `page-stack` 的打印态必须是 `display: block`，不能只是把 `gap` 归零。flex 容器跨页拆分
> 在 Chrome 里会产生空白页，而空白页正是这个项目最怕的产物。

`border-dotted` / `grayscale` / `content-['']` wind3 均支持，无需兜底写法。

### 7.6 `rules` 与色板

- **无需自定义 `rules`**：项目符号、点线、灰度都能用 variant/arbitrary 表达。
- **无需覆盖色板**：wind3 的默认色板与 Tailwind 3 同源，`default` 模板用到的
  `blue-*` / `gray-*` 全档位开箱即得，迁移前后无可见差异。
  这一节在 wind4 下才需要，以前那份对照表随预设选型一起作废。

### 7.7 类名兼容性核查

切换前用下面两条命令导出全量类名（**必须包含 `:class` 动态绑定**，只抓 `class="` 会漏）：

```bash
grep -RhoE ':?class="[^"]*"' src --include=*.vue
grep -RhoE '(bg|text|border)-(blue|gray)-[0-9]+' src --include=*.vue | sort -u
```

逐类确认渲染结果。需要覆盖的高风险类（当前代码实测清单）：

| 类别 | 具体类名 | 关注点 |
|---|---|---|
| 间距 | `space-y-1/2/3/6`、`gap-1.5`、`mb-1/2/3/4/5/6/8`、`py-0.5` | wind3 用相邻兄弟选择器实现 |
| 尺寸 | `h-1.5`、`h-16/24/32`、`w-16/20/24/32` | 小数档位 |
| 圆角 | `rounded`、`rounded-lg`、`rounded-full` | 默认值 |
| 交互 | `hover:bg-blue-700`、`focus:border-blue-600`、`focus:outline-none`、`focus-visible:*`、`disabled:opacity-50`、`transition-colors` | 变体链路 |
| 布局 | `shrink-0`、`flex-1`、`min-w-0`、`mx-auto`、`list-disc`、`ml-5`、`object-cover` | 语义别名 |
| 颜色 | `bg-primary`、`border-border`、`bg-tag-bg`、`text-text-primary`、`text-text-secondary`、`border-gray-900` | 自定义键命名 |
| 打印 | `.no-print`（自定义类，非工具类） | 不参与 UnoCSS |

### 7.8 文件改动清单

| 动作 | 文件 |
|---|---|
| 新增 | `uno.config.ts` |
| 删除 | `tailwind.config.js` |
| 修改 | `vite.config.ts`（加 `UnoCSS()`）、`postcss.config.js`（去 tailwind）、`package.json`（去 `tailwindcss`）、`src/main.ts`（reset → `virtual:uno.css` → `style.scss`）、`src/style/style.scss`（去 `@tailwind`，**保留 `:root --a4-*`**）、`src/components/A4.vue`（shortcut + 打印断开）、`src/components/page/ResumeSheet.vue`（shortcut + 删 `:deep()`） |
| 可选（最后做） | `src/templates/classic/blocks/*.vue` 改用 shortcut 类名；`src/pages/index.vue` 的 `.resume-list` 改 `page-stack` |

`ResumeSheet.vue` 的 `ResizeObserver` **保留**：它服务 `default` 模板的旧路径，与流式模板
的「不测量」原则不冲突；本次只删字号 `:deep()`。

---

## 8. 数据契约改动

### 8.1 `PersonalProject` 接入 `ResumeData`

| 文件 | 改动 |
|---|---|
| `src/types/resume.ts` | `ResumeData` 增加 `personalProjects: PersonalProject[]`（必填，空数组表示无） |
| `src/data/index.ts` | demo 分支补 `personalProjects: []`；真实分支 `realData.personalProjects ?? []` |
| `src/mydata/index.ts` | glob 由 `['./*.ts', '!./index.ts', '!./personal-projects.ts']` 改为 `['./*.ts', '!./index.ts']` |
| `src/mydata/index.ts` | 增加 `personalProjects` / `openSource` 的 `pick` 与类型 |

### 8.2 `hasRealData` 白名单

`hasRealData` 原先用 `Object.values(realData).every(v => v !== undefined)`，新增可选字段会让
整份真实数据**静默回退演示数据**。改为显式必选白名单：

```ts
const REQUIRED_KEYS = [
  'personalInfo', 'personalSkills', 'languages', 'education',
  'advantages', 'workExperience', 'projects',
] as const
export const hasRealData = REQUIRED_KEYS.every((k) => realData[k] !== undefined)
```

`personalProjects` / `openSource` 视为可选：缺失只少一个版块。

### 8.3 语言能力并入个人优势

- 数据只读 `resumeData.languages`，**不新增字段**（现有 `Language { name, level, description }` 足够）。
- 取用：在 `buildAdvantages()` 末尾追加一条 bullet，文本为
  `语言：${languages.map(l => `${l.name}（${l.level}）`).join('、')}。`
- 只有 `languages.length > 0` 时才追加；不加独立版块标题，不进个人信息区。
- 实际渲染示例：`语言：英语（CET-6 / 流利）、日语（N2 / 基础）。`

### 8.4 个人项目转 bullet 的优先级（以实现为准）

文档 `architecture-design.md` §7 写的优先级与代码不一致，**以 `build.ts` 为准**：

1. `description`（1 条）
2. `highlights`（最多 4 条）
3. `architecture`（最多 2 条，格式 `层：详情`）
4. `accessModel[0]`（1 条）
5. `terminals` 名称合并成 1 条：`终端：A、B`

总上限 `PERSONAL_PROJECT_LIMIT = 8`，超出截断。建议后续把架构文档 §7 改成这份顺序。

---

## 9. 运行期兜底（不是断言）

只保留**功能性兜底**，即「不加就会死循环或崩页面」的处理。诊断性断言一律不写。

| 层级 | 机制 | 触发条件 | 表现 |
|---|---|---|---|
| 分页 | `paginate` 兜底分支 | 单块 `gap + lines > maxLines` 且页为空 | 该块独占一页并继续，**必须保留**，否则死循环 |
| 数据 | `data/index.ts` | `VITE_USE_REAL_DATA=true` 但 `hasRealData=false` | `console.warn` 并回退演示数据（既有行为，不动） |
| 空版块 | `build.ts` 的 `pushSection` | 该版块内容块为空 | 不输出标题，不占行 |
| 头像 | `ProfileHeader` | `avatar` 为空 | 显示首字占位，尺寸不变，不影响估算 |

不做的事：溢出红框、`scrollHeight` 测量、字体就绪等待、任何按页轮询的检查。

---

## 10. 实施顺序

> 验收与测试全部由人工完成，本文不设验收条目，也不写单元测试。
> 下列表格只描述「按什么顺序改哪些文件」，每阶段结束提交一次 commit。

### 阶段 A：流式模板

| # | 步骤 | 涉及文件 |
|---|---|---|
| A1 | 类型与引擎 | `types/flow.ts`、`utils/index.ts`、`utils/metrics.ts`、`utils/paginate.ts` |
| A2 | 纸张与块渲染 | `components/A4.vue`（加纸间分页断开）、`components/BlockRenderer.vue` |
| A3 | 版块组件 | `templates/classic/blocks/` 五个组件 |
| A4 | 建模与渲染 | `templates/classic/build.ts`、`templates/classic/ClassicFlow.vue` |
| A5 | 注册与切换 | `types/template.ts`（`flow`）、`templates/classic/index.ts`、`pages/index.vue` |
| A6 | 数据契约 | `types/resume.ts`、`data/index.ts`、`mydata/index.ts` |

### 阶段 B：UnoCSS 迁移（wind3）

阶段 A 验收通过并提交后再开工，两阶段不混在一个 commit 里。

| # | 步骤 | 涉及文件 |
|---|---|---|
| B1 | 接入 UnoCSS | `uno.config.ts`（新增）、`vite.config.ts`、`postcss.config.js`、`package.json`、`main.ts`、`style/style.scss` |
| B2 | theme 落地 | `uno.config.ts`：`A4` 变量映射、`fontSize` 两组、`colors`、`boxShadow`、`letterSpacing` |
| B3 | 去 `:deep()` | `components/page/ResumeSheet.vue` 删字号覆盖块 |
| B4 | 改 shortcut | `components/A4.vue`、`components/page/ResumeSheet.vue`、`pages/index.vue` |
| B5 | 清理 Tailwind | 删 `tailwind.config.js`，卸载 `tailwindcss` |

---

## 11. 仍未定 / 有分歧

1. **`classic` 旧单页实现仍在仓库里**：`templates/classic/pages/page-1.vue` 当前存在且
   `classic/index.ts` 正引用它。注意 `src/templates/` 尚未纳入版本控制，
   **动它之前先提交一次基线**，否则没有可回退的点。A5 之后它作为 fallback 保留，
   待流式版验收通过再删。
2. **页尾悬空守卫**：规则见 4.3 ③，当前**未实现**。是否启用取决于后续出现「页尾孤条」的频率。
3. **续页孤行取舍**：某项目只有 2 条 bullet 且恰好跨页时，优先保证页尾完整，允许续页只剩 1 条。
4. **页码 / 页眉**：本期不做。若要做，`A4` 加顶部 `slot`（`header`），并从
   `MAX_LINES_PER_PAGE` 扣掉页眉占用的行数。
5. **估算精度**：中文 1、半角 0.5 的折算对大段英文和长 URL 偏乐观，需按实际排版回调 `CHARS_PER_LINE`。
6. **shortcuts 收敛范围**：B4 只做纸张层与页面壳；`classic/blocks/*` 是否全面改类名属于可选，
   收益是统一管理，代价是改动面变大。
7. **静态模板 `pages[]` 的打印语义**：`default` 模板的三页目前靠 `ResumeSheet` 自己写
   `break-after`；若后续统一到 `A4`，需要把这三页也换成 `<A4>`，否则会出现两套分页规则。
8. **`ResumeSheet` 的去留**：`default` 模板仍在用它；等 `default` 迁到流式模板后可整块删除。
