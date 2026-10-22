# 个人简历项目

一个基于 Vue 3 + TypeScript + Tailwind CSS 构建的现代化个人简历应用。

## 技术栈

- **框架**: Vue 3 + Composition API
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS 3
- **PDF导出**: 浏览器原生打印功能

## 项目结构

```
src/
├── components/           # 组件目录
│   ├── page/            # 页面层（一个文件夹 = 一张纸）
│   │   ├── ResumeSheet.vue                    # 单页容器：统一纸张尺寸，跨页共用
│   │   ├── personal-info/index.vue            # 个人信息页：技能、教育、工作经历
│   │   ├── project-experience/index.vue       # 项目经历页
│   │   └── personal-projects/index.vue        # 个人项目页（内容补齐后启用）
│   └── section/         # 区块层
│       ├── PersonalHeader.vue      # 头像、姓名、职位
│       ├── BasicInfo.vue           # 基本信息
│       ├── SkillsSection.vue       # 专业技能
│       ├── LanguagesSection.vue    # 语言能力
│       ├── EducationSection.vue    # 教育背景
│       ├── AdvantagesSection.vue   # 个人优势
│       ├── WorkExperienceSection.vue # 工作经历
│       ├── ProjectsSection.vue     # 项目经历
│       └── OpenSourceSection.vue   # 开源项目
├── data/                # 数据目录
│   └── resume-data.ts   # 简历数据配置
├── style.css            # 全局样式
├── App.vue              # 根组件
└── main.ts              # 入口文件
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 使用说明

### 修改简历内容

所有简历数据都存储在 `src/data/resume-data.ts` 文件中，包括：

- **个人信息**: 姓名、职位、头像、联系方式等
- **专业技能**: 前端基础、框架与库、工程化、其他技能
- **语言能力**: 语言名称、等级、描述
- **教育背景**: 学校、专业、时间段、亮点
- **个人优势**: 核心竞争力描述
- **工作经历**: 公司、职位、职责、业绩
- **项目经历**: 项目名称、标签、描述、职责、技术栈、成果
- **开源项目**: 项目名称、GitHub链接、功能、亮点、贡献

### 调整纸张尺寸

所有页面共用一套尺寸变量，定义在 `src/style.css` 的 `:root` 中：

```css
--resume-page-width: 210mm;
--resume-page-height: 297mm;
--resume-page-padding: 12mm 16mm;
```

修改后屏幕预览与 PDF 导出会同步变化。注意 `@page { size: A4 }` 无法使用 CSS 变量，若改成非 A4 纸张需同步修改该处。

页面容器 `ResumeSheet` 为固定尺寸并裁切溢出内容。页内内容超出单页时，屏幕预览会给该页加红色描边，并在控制台输出溢出像素数；打印产出中不会有描边。

### 布局与间距

同批变量还控制分栏比例与纵向间距：

```css
--resume-col-left: 1fr;        /* 个人信息页左栏 */
--resume-col-right: 2fr;       /* 个人信息页右栏 */
--resume-column-gap: 24px;
--resume-section-gap: 16px;    /* 同栏内 section 之间 */
--resume-field-gap: 10px;      /* section 内字段之间 */
--resume-item-gap: 20px;       /* 项目条目之间 */
--resume-line-gap: 2px;        /* 列表行之间 */
```

版式分工：**个人信息页**用 `display: grid` 做左右分栏（`.resume-grid-cols`）；**项目经历页 / 个人项目页**是单列纵向流，用 `display: flex`（`.resume-flex-col`）。各段间距统一由上述变量经 `gap` 控制，不再依赖 `space-y-*` / `mb-*` 这类 margin 叠加。

### 样式放置约定

`src/style.css` 只保留**全局设计令牌与基础设置**（`:root` 变量、根字号锁定、`@page`、打印背景色）。

组件的布局与样式写在各自 `.vue` 的 `<style scoped>` 中：

| 位置 | 内容 |
|---|---|
| `page/ResumeSheet.vue` | 单页尺寸与 grid 骨架、字号锁定、打印分页规则 |
| `page/personal-info/index.vue` | 两栏 grid、栏内 flex 堆叠 |
| `page/project-experience/index.vue`、`page/personal-projects/index.vue` | 单列 flex、条目内堆叠 |
| `App.vue` | 屏幕堆叠间距、打印时隐藏按钮 |

注意：`ResumeSheet` 的内容来自 `<slot>`，`scoped` 选择器默认不作用于 slot 内容，因此字号锁定使用 `:deep()`。

### 字号与版面稳定性

`html` 根字号被钉死为 `16px`，且 `.resume-page` 内的字号档位（`text-xs` ~ `text-3xl`）覆写为 px。原因是 Tailwind 的间距与字号都以 `rem` 为单位，会跟随浏览器默认字号缩放，导致版面变高、内容被裁切。锁定后版面稳定，用户调整浏览器字号不会影响导出结果。

### 添加头像

将您的证件照放入 `public/` 目录下，命名为 `证件照.png`，或修改 `resume-data.ts` 中的头像路径。

### 导出 PDF

点击页面顶部的「导出 PDF」按钮，在弹出的打印对话框中选择「另存为 PDF」即可导出。

## 功能特性

- ✅ 三页简历布局（符合 A4 纸张尺寸）
- ✅ 响应式设计，支持多种屏幕尺寸
- ✅ 一键导出 PDF（保持样式一致性）
- ✅ 组件化架构，易于维护和扩展
- ✅ 完整的 TypeScript 类型支持

## 许可证

MIT License