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
│   ├── page/            # 页面层
│   │   ├── ResumePage1.vue   # 第一页：个人信息、技能、教育、工作经历
│   │   ├── ResumePage2.vue   # 第二页：项目经历
│   │   └── ResumePage3.vue   # 第三页：开源项目
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