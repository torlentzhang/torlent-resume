# 简历流式模板架构设计（行数估算版）

> 状态：设计稿（流式实现已回退，待确认后按 §10 开工）
> 目标模板：`classic`（单栏、黑白灰、传统文档风）
> 结论先行：不分页测量，不做 DOM 度量。每个内容块声明估算行数，按页累加行数，超过每页可用行数就换页；配一个保守系数让估算偏大，宁可页尾留白也不裁内容。

---

## 1. 目标与非目标

### 目标

1. **一条流**：版块顺序固定，页数由内容决定；项目经历与个人项目连续排布。
2. **按行记账分页**：块是分页最小粒度，不切割单个 bullet 的多行文本。
3. **预览即打印**：屏幕上的每张纸与打印出的每页尺寸、边距一致。
4. **可调参**：每行容量、行高、保守系数集中一处，改一个数字即可整体收紧/放宽。
5. **自用**：数据仍来自 `src/data` 与 `src/mydata`，不引入编辑器、后端。

### 非目标

- 不做可视化编辑器，不做字段增删 UI。
- 不做精确测量：**不用** `getBoundingClientRect` / `offsetHeight` 做分页，**不用** `ResizeObserver`，不做字体版本失效。
- 不做自动排版美化（字号自适应、两端对齐微调）。
- 不做多栏版式。
- 本期不做页眉与页码。

---

## 2. 目录结构

```
src/
├── types/                          # 类型统一出口，业务代码只从 @/types 引用
│   ├── index.ts                    # export * from './resume' / './template' / './flow'
│   ├── resume.ts                   # ResumeData / PersonalInfo / …
│   ├── template.ts                 # ResumeTemplate（pages | flow）
│   └── flow.ts                     # Block / PageBlock / ResumePageModel（流式专用）
├── utils/                          # 纯函数统一出口
│   ├── index.ts                    # export * from './metrics' / './paginate'
│   ├── metrics.ts                  # 估算参数（唯一调参处）+ 文本行数估算
│   └── paginate.ts                 # 装箱分页（纯函数）
├── components/
│   ├── A4.vue                      # 纸张层：尺寸/内边距/白底/裁切/纸间分页断开
│   ├── page/ResumeSheet.vue        # default 模板继续使用，不改
│   └── BlockRenderer.vue           # 新增：按 block 渲染组件 + 块间距
├── templates/
│   ├── registry.ts                 # 不改（glob 自动收集）
│   ├── default/                    # 不改（静态三页）
│   └── classic/
│       ├── index.ts                # 当前指向单页版式
│       ├── pages/page-1.vue        # 当前实现：单页黑白灰
│       └── blocks/                 # 计划：流式版块组件（ProfileHeader 等）
└── style/style.scss                # 不改
```

分层：**纸张层**（A4）只管一张纸的尺寸与纸间分页断开，**版块层**纯展示，**模板层**声明顺序与估算，**引擎层**（`src/utils/`）不认识简历语义。**没有独立的页组件层**：每页就是 `<A4 v-for="page in pages">`。

目录硬约定：类型只在 `src/types/` 定义、业务代码只从 `@/types` 引用；纯计算只在 `src/utils/`，组件内不写可复用逻辑。

---

## 3. 数据流

```
resumeData
  → build.ts             建模：展开为扁平 Block[]（含 lines / gapBefore / groupId）
  → utils/paginate.ts    装箱：按行累加，切分为 ResumePageModel[]
  → 渲染                 <A4 v-for> → <BlockRenderer v-for>
```

三个阶段都是同步纯计算，没有异步等待、没有隐藏容器、没有二次渲染。

---

## 4. 行数估算与分页规则

### 4.1 参数（`src/utils/metrics.ts`）

| 参数 | 值 | 说明 |
|---|---|---|
| `LINE_HEIGHT` | 22px | 正文一行的实际高度（12px × 1.8 ≈ 21.6） |
| `PAGE_CONTENT_HEIGHT` | 1031.8px | 297mm − 12mm×2，对应 `--a4-height` / `--a4-padding` |
| `SAFETY_FACTOR` | 1.05 | 保守系数，估算偏大 5% |
| `MAX_LINES_PER_PAGE` | `floor(1031.8 / 22 / 1.05)` = **44** | 每页可用行数 |
| `CHARS_PER_LINE` | 52 | 正文每行可容纳的全角字符数 |
| 字符权重 | 全角 1、半角 0.5 | 中英混排的粗略折算 |

### 4.2 块的估算行数

| 块 | 行数 |
|---|---|
| 个人信息 | 6（固定） |
| 版块标题 | 1 |
| 条目头（教育/工作） | 0.9 |
| 项目头 | 1.7 |
| 项目续页头 | 1 |
| bullet | `ceil(字符权重和 / 52)`，每行 1 |

间距也按行计：版块间 1.2、条目间 0.6、bullet 间 0.2。

### 4.3 分页伪代码

```
paginate(blocks, maxLines):
  pages = [[]]; used = 0
  for block in blocks:
    gap = 本页为空 ? 0 : block.gapBefore
    need = gap + block.lines

    # 续页头：本页还没有该组的头，就先占一行
    if block.groupId and 本页无该组头:
      need += 0.6 + 1

    # 标题孤行：标题必须和下一块同页
    if block.keepWithNext and 有下一块:
      need += 下一块的 gap + lines

    if used + need > maxLines and 本页非空:
      新开一页; 重试同一块        # 重试时本页为空，续页头自动补上
      continue

    if used + need > maxLines and 本页为空:
      warn("块高于整页")          # 兜底，避免死循环
    放置 block; used += need
```

### 4.4 三条规则

1. **标题孤行**：`keepWithNext` 让标题与下一块作为整体参与容量判断，放不下就一起换页。
2. **续页重复项目名**：换页后若本页缺少该组的头，自动插入「项目名（续）」并计入行数。
3. **续页孤行**：换页后某组在续页只剩 1 条 bullet 时，从上一页再挪 1 条下来（仅当上一页该组仍 ≥2 条、且续页放得下）。

### 4.5 溢出断言（仅开发期）

`ClassicFlow.vue` 在 `document.fonts.ready` 后遍历一次 `.a4-sheet`，读 `scrollHeight - clientHeight`：大于 1px 就加红框并 `console.warn`。它只用于暴露「估算不准」，不参与分页，也不监听尺寸变化；`A4` 本身不测量。

---

## 5. 组件契约

| 组件 | props | 职责 |
|---|---|---|
| `A4.vue` | `padding?: boolean` | 尺寸/内边距/白底/裁切；`.a4-sheet:not(:last-child) { break-after: page }`；不测量、不读数据 |
| `ClassicFlow.vue` | 无 | 读 `resumeData` → `buildBlocks` → `paginate` → `v-for` 出多个 `<A4>`；开发期溢出断言 |
| `BlockRenderer.vue` | `block: PageBlock` | `<component :is>` + `margin-top: gapBefore × LINE_HEIGHT` |
| `ProfileHeader.vue` | `info: PersonalInfo` | 左圆形头像 + 姓名 + 意向岗位；右侧其它信息；细线分隔 |
| `SectionTitle.vue` | `text: string` | 标题 + 下边框 |
| `EntryHead.vue` | `title`、`subtitle?`、`period?`、`location?` | 左右两端条目头 |
| `Bullet.vue` | `text: string` | 悬挂项目符号 |
| `ProjectHead.vue` | `project: Project`、`continuation?: boolean` | 项目名/时间/标签/技术栈，或「（续）」 |

约定：版块组件只收 props、不读 `resumeData`；根节点不带纵向 `margin`（间距由 `gapBefore` 统一给）。

`ResumeTemplate` 扩展为：

```ts
interface ResumeTemplate {
  id: string; name: string; description?: string
  pages?: Component[]   // 静态模板：一个元素 = 一张纸
  flow?: Component      // 流式模板：组件内部按估算分页
}
```

`pages/index.vue` 有 `flow` 就渲染单个组件，否则走原 `v-for`。`default` 模板不受影响。

---

## 6. 版块清单与顺序

| # | 版块 | 数据来源 | 备注 |
|---|---|---|---|
| 1 | 个人信息 | `personalInfo` | 首页顶部；圆形头像 + 右侧其它信息 |
| 2 | 教育背景 | `education` | 条目头 + highlights |
| 3 | 个人优势 | `advantages` + `languages` | **语言能力并入本版块**，在优势末尾合成一句 |
| 4 | 工作经历 | `workExperience` | 职责 + 业绩合并为 bullet |
| 5 | 项目经历 | `projects` | 项目头 + 描述/职责/业绩 |
| 6 | 个人项目 | `personalProjects` | 与项目经历同一流向，不强制分页 |

「专业技能」（`personalSkills`）**本期不展示**：数据字段与类型保留，仅从 `build.ts` 的版块列表中移除，后续想加回来只需加一段建模。

语言能力的合并方式：取 `languages` 生成一句 `英语（CET-6）可作为工作语言`，作为优势列表的最后一条 bullet，不单独占标题。

---

## 7. 数据契约缺口

| 缺口 | 处理 |
|---|---|
| `PersonalProject` 不在 `ResumeData` | 加入 `ResumeData.personalProjects: PersonalProject[]`（必填，空数组表示无） |
| 真实数据入口排除个人项目 | `src/mydata/index.ts` 的 glob 去掉 `!./personal-projects.ts`，并加 `pick` |
| `hasRealData` 会误判 | 改为**必选项白名单**校验，`openSource` / `personalProjects` 视为可选 |
| 演示数据没有个人项目 | `src/data/index.ts` 中 demo 分支填 `[]` |
| `Language` 无熟练度 | 不新增字段；直接拼 `name + level + description` |

`PersonalProject` 字段远多于 `Project`，`build.ts` 按固定优先级转 bullet：`description` → `accessModel` → `architecture`（最多 3 条）→ `terminals`（只取终端名）→ `highlights`，总数上限 8 条，超出截断并告警。

---

## 8. 失败兜底

| 场景 | 行为 |
|---|---|
| 单块估算高度超过整页 | 该块独占一页，`console.warn` 指明块 id，绝不循环换页 |
| 估算偏小导致真实溢出 | `ClassicFlow` 红框 + `console.warn`，提示调小 `CHARS_PER_LINE` 或调大 `SAFETY_FACTOR` |
| 数据为空（某版块无条目） | 跳过该版块，不输出空标题 |
| 头像为空或加载失败 | 隐藏图片、保留占位尺寸，不影响行数估算 |
| 真实数据缺失 | 沿用现有回退：整体回退演示数据；个人项目缺失只影响该版块 |

---

## 9. 扩展点

| 需求 | 改动 |
|---|---|
| 新增流式模板 | 新建 `src/templates/<id>/{index.ts, ClassicFlow 同名组件, build.ts, blocks/}`，`registry.ts` 自动收集 |
| 新增版块 | `templates/classic/build.ts` 加一段建模 + `blocks/` 加组件 |
| 调整版块顺序 | 只改 `build.ts` 的顺序 |
| 恢复「专业技能」 | 在 `build.ts` 版块列表里加回一段（数据与类型都在） |
| 换纸型 | `src/style/style.scss` 的 `:root` 三个 `--a4-*` + `@page size`；同步 `PAGE_CONTENT_HEIGHT` |
| 排版变紧/变松 | 只调 `metrics.ts` 的 `CHARS_PER_LINE` / `LINE_HEIGHT` / `SAFETY_FACTOR` |

---

## 10. 实施步骤

1. **引擎**：`types/flow.ts` + `utils/metrics.ts` + `utils/paginate.ts`（纯函数，可单测）。
2. **纸张与块**：`A4.vue`（含纸间分页断开）+ `BlockRenderer.vue`，验证屏幕与打印一致。
3. **版块**：`blocks/*.vue` 五个组件，先静态渲染。
4. **模板**：`build.ts` + `ClassicFlow.vue`，跑通多页。
5. **注册**：`ResumeTemplate.flow` + `pages/index.vue` 分支，切换器可选两套模板。
6. **数据**：接入 `personalProjects` 并修 `hasRealData`。
7. **验收**：两模板可切换；流式模板多页；开发期无溢出红框与告警；`npm run build` 通过。

---

## 11. 待定问题

1. **`classic` 单页实现**：当前保留 `pages/page-1.vue`（单页黑白灰，含专业技能与语言版块）；流式版落地并验收后再由 `flow` 替换，旧实现届时删除。
2. **续页孤行取舍**：某项目只有 2 条 bullet 且恰好跨页时，优先保证页尾完整，允许续页只剩 1 条。
3. **页码/页眉**：本期不做；如要做，`A4` 加顶部 slot，并把页眉占用行数从 `MAX_LINES_PER_PAGE` 扣掉。
4. **估算精度**：中文按 1、英文按 0.5 折算，遇到大段英文或长 URL 会偏乐观，需按实际效果微调 `CHARS_PER_LINE`。
