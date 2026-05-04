export interface Language {
  name: string;
  level: string;
  description: string;
}

export interface Education {
  school: string;
  major: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface WorkExperience {
  company: string;
  position: string;
  period: string;
  location: string;
  responsibilities: string[];
  achievements: string[];
}

export interface Project {
  name: string;
  period: string;
  tags: string[];
  description: string;
  responsibilities: string[];
  techStack: string[];
  achievements: string[];
}

export interface OpenSourceProject {
  name: string;
  githubUrl: string;
  period: string;
  meta: string;
  description: string;
  features: string[];
  highlights: string[];
  contributions: string[];
}

export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    avatar: string;
    birthDate: string;
    workYears: string;
    education: string;
    maritalStatus: string;
    expectedSalary: string;
    availableDate: string;
  };
  skills: {
    frontend: string[];
    frameworks: string[];
    engineering: string[];
    other: string[];
  };
  languages: Language[];
  education: Education[];
  advantages: string[];
  workExperience: WorkExperience[];
  projects: Project[];
  openSource: OpenSourceProject[];
}

export const resumeData: ResumeData = {
  personalInfo: {
    name: "张三",
    title: "高级前端开发工程师",
    avatar: "/证件照.png",
    birthDate: "1995年06月",
    workYears: "7年",
    education: "硕士",
    maritalStatus: "未婚",
    expectedSalary: "35K-45K",
    availableDate: "1个月内",
  },
  skills: {
    frontend: ["HTML5/CSS3", "JavaScript/ES6+", "TypeScript", "响应式设计"],
    frameworks: ["React", "Vue.js", "Next.js", "Node.js"],
    engineering: ["Webpack/Vite", "Git/GitFlow", "CI/CD", "单元测试"],
    other: ["Docker", "微前端", "性能优化"],
  },
  languages: [
    {
      name: "英语",
      level: "CET-6 / 流利",
      description:
        "具备良好的英文听说读写能力，可无障碍阅读技术文档，参与国际项目交流。",
    },
    {
      name: "日语",
      level: "N2 / 基础",
      description: "具备基础的日语阅读和简单交流能力，可阅读日文技术文档。",
    },
  ],
  education: [
    {
      school: "清华大学",
      major: "计算机科学与技术 - 硕士",
      period: "2017.09 - 2020.06",
      location: "北京",
      highlights: [
        "专业排名：前5%，获得国家奖学金、一等奖学金多次",
        "研究方向：前端性能优化、低代码平台开发",
        "发表论文：在国内核心期刊发表《前端工程化实践与性能优化》相关论文2篇",
      ],
    },
  ],
  advantages: [
    "7年前端开发经验，擅长复杂系统架构设计与性能优化，主导过多个千万级用户产品的前端架构设计与重构工作",
    "精通React、Vue等主流前端框架，有丰富的微前端、低代码平台开发经验，能够独立承担大型前端项目的技术选型与架构设计",
    "具备良好的产品思维和用户体验意识，能够从业务角度出发提供最优的技术解决方案，多次主导产品核心功能的设计与开发",
    "有丰富的团队管理经验，带领过10人以上的前端团队，擅长技术分享和团队能力建设，帮助团队成员快速成长",
    "热爱开源技术，在GitHub上有多个开源项目，累计获得Star 2.8K+，是多个知名开源项目的Contributor",
  ],
  workExperience: [
    {
      company: "字节跳动",
      position: "高级前端开发工程师 / 前端技术负责人",
      period: "2021.03 - 至今",
      location: "北京",
      responsibilities: [
        "负责抖音电商平台前端架构设计与技术选型，主导多个核心业务模块的开发与重构工作",
        "带领8人前端团队，负责项目进度管理、代码Review、技术方案评审等工作，保障项目高质量交付",
        "主导前端性能优化专项，通过代码分懒加载、懒加载、缓存策略等手段，将页面首屏加载时间从2.8s优化到1.2s，提升用户体验",
      ],
      achievements: [],
    },
    {
      company: "阿里巴巴",
      position: "前端开发工程师",
      period: "2020.07 - 2021.02",
      location: "杭州",
      responsibilities: [
        "参与淘宝移动端核心业务模块开发，负责商品列表页、购物车等核心页面的开发与维护",
        "参与前端组件库建设，开发通用组件20+，被多个业务线复用，减少重复开发工作量",
        "参与性能优化专项，将移动端页面首屏加载时间优化提升40%，用户留存率提升5%",
      ],
      achievements: [],
    },
  ],
  projects: [
    {
      name: "抖音电商详情页重构项目",
      period: "2022.06 - 2023.03",
      tags: ["项目负责人", "架构设计", "性能优化"],
      description:
        "抖音电商详情页是抖音电商核心流量入口，日均PV超过10亿。随着业务快速迭代，原有架构存在代码冗余、性能低下、维护困难等问题。本项目旨在对详情页进行全面重构，提升页面性能、可维护性和用户体验。",
      responsibilities: [
        "负责项目整体架构设计，制定重构方案和技术规范，协调产品、设计、后端等多个团队推进项目落地",
        "主导核心性能提升专项，包括组件懒加载、状态管理优化、渲染优化策略等，解决多个技术难点",
        "制定项目进度计划，把控项目风险，带领8人团队按时高质量完成项目交付",
      ],
      techStack: ["React", "TypeScript", "Redux", "Webpack", "Node.js", "SSR"],
      achievements: [
        "页面首屏加载时间从2.8s优化到1.2s，慢开率下降65%，用户停留时长提升15%",
        "商品转化率提升8%，带动GMV增长超过10亿元，获得公司年度技术创新一等奖",
        "代码可维护性大幅提升，新需求开发效率提升40%，线上故障率下降70%",
        "重构方案在公司内多个业务线推广使用，形成了标准化的电商页面重构方法论",
      ],
    },
    {
      name: "企业级低代码平台开发",
      period: "2021.08 - 2022.05",
      tags: ["核心开发", "低代码", "可视化搭建"],
      description:
        "为了提升公司内部运营系统开发效率，降低开发成本，团队决定开发一套企业级低代码平台，支持通过拖拽方式快速搭建后台管理系统、活动页、表单等各类应用，赋能非技术人员也能快速构建系统。",
      responsibilities: [
        "负责平台核心引擎设计与开发，包括拖拽编辑器、组件渲染引擎、DSL设计、代码生成器等核心模块",
        "负责组件库设计与开发，沉淀通用业务组件50+，覆盖表单、列表、图表、布局等常用场景",
        "设计并实现组件扩展机制，支持自定义组件接入，满足复杂业务场景需求",
        "编写平台使用文档和培训材料，在公司内部推广使用，提供技术支持",
      ],
      techStack: [
        "Vue.js",
        "TypeScript",
        "JSON Schema",
        "Vite",
        "Node.js",
        "MongoDB",
      ],
      achievements: [
        "平台上线后，累计搭建应用超过300个，覆盖运营、客服、风控等多个业务线，节省开发人力超过200人/年",
        "普通运营页面开发周期从原来的2周缩短到3天，极大提升了业务响应速度",
        "平台获得公司内部技术创新奖，成为公司标准化的内部系统开发工具",
        "相关技术方案在国内前端技术大会分享，获得行业广泛认可",
      ],
    },
    {
      name: "前端性能监控平台",
      period: "2021.03 - 2021.07",
      tags: ["个人主导", "监控系统", "数据分析"],
      description:
        "随着公司业务快速发展，前端页面数量越来越多，缺乏统一的性能监控和告警机制，线上问题发现滞后，影响用户体验。本项目旨在搭建一套全链路前端性能监控平台，实现性能数据采集、分析、告警一体化，提升问题定位效率。",
      responsibilities: [
        "独立负责平台整体设计与开发，包括SDK设计开发、数据采集方案、后端服务、可视化分析系统等全链路开发",
        "设计并实现性能数据采集SDK，支持页面性能、错误、用户行为等多维度数据采集，对业务代码侵入极低",
        "开发数据可视化分析系统，提供多维度性能数据分析、趋势对比、异常告警等功能",
        "制定性能优化标准和流程，推动各业务线接入平台，建立性能监控体系",
      ],
      techStack: [
        "JavaScript",
        "React",
        "ECharts",
        "Node.js",
        "Kafka",
        "ClickHouse",
      ],
      achievements: [
        "平台覆盖公司90%以上的前端应用，日均处理数据量超过5亿条，线上故障发现时间从平均4小时缩短到5分钟",
        "通过平台发现并解决性能问题超过200个，公司整体前端页面首屏加载时间平均提升30%",
        "累计为公司节省服务器资源成本超过500万元，获得公司季度技术创新奖",
        "相关技术方案申请发明专利2项，在行业内具有领先水平",
      ],
    },
  ],
  openSource: [
    {
      name: "FormBuilder",
      githubUrl: "https://github.com/zhangsan/form-builder",
      period: "2020.03 - 至今",
      meta: "1.5K ⭐ | V 3.2.0 | MIT License",
      description:
        "FormBuilder是一款高性能、可扩展的可视化表单构建器，支持通过拖拽方式快速生成复杂表单，内置丰富的基础组件和校验规则，支持自定义扩展，可嵌入到各类业务系统中使用。目前已被超过250家公司在生产环境使用。",
      features: [
        "可视化拖拽构建，操作简单直观，支持实时预览",
        "支持五十多种表单组件，满足各类复杂表单需求",
        "内置强大的表单校验规则，支持自定义校验规则和异步校验",
        "支持表单联动、数据绑定、条件渲染等高级功能",
        "支持导出JSON Schema、Vue代码、React代码等多种格式",
      ],
      highlights: [
        "基于Vue3和TypeScript的设计，性能优异、类型友好",
        "手写虚拟滚动渲染器，即使复杂表单也能保持流畅的操作体验",
        "插件化架构，核心功能与扩展逻辑解耦，便于二次开发",
        "完善的中文文档和使用示例，降低用户学习成本",
      ],
      contributions: [
        "项目创始人&核心维护者，负责整体架构设计和核心功能开发",
        "社区活跃维护者，有详细的贡献指南和代码规范",
        "响应过社区Issue和PR，帮助解决用户问题，指导新贡献者参与开发",
        "通过Discord、QQ等渠道维护社区，提供线上多个开发资源",
      ],
    },
    {
      name: "TablePro",
      githubUrl: "https://github.com/zhangsan/table-pro",
      period: "2021.05 - 至今",
      meta: "850 ⭐ | V 1.2.0 | MIT License",
      description:
        "TablePro是一款高性能、功能丰富的企业级数据表格组件，专为中后台系统设计，内置了排序、筛选、分页、导出、虚拟滚动、编辑等高级功能，开箱即用，同时支持高度自定义，满足各种复杂企业业务场景需求。",
      features: [
        "高性能虚拟滚动，支持百万级数据量的流畅渲染",
        "内置多种列类型：文本、数字、日期、选择器、状态标签、操作列等",
        "支持单元格编辑、行编辑、批量编辑等多种编辑模式",
        "支持灵活的筛选、排序、分页功能，支持自定义筛选器",
        "支持Excel导出、PDF导出、打印等功能",
        "支持列拖拽调整、列显示/隐藏、列宽调整等交互",
        "完善的主题系统，支持黑暗模式",
      ],
      highlights: [
        "优秀的性能表现，即使虚拟10万行数据也能保持60fps的流畅体验",
        "完整的TypeScript类型支持，提供类型安全的开发体验",
        "内置国际化支持，支持简体中文和英文两种语言",
        "可插拔的架构模式，支持按需引入和扩展",
      ],
      contributions: [
        "项目创始人，负责整体架构设计和性能优化",
        "主导核心功能开发，包括虚拟滚动、列编辑、数据导出等",
        "编写详细的中文文档和使用示例，降低用户学习门槛",
        "目前被多个企业级项目使用，累计Star超过1.5K",
      ],
    },
    {
      name: "UtilsKit",
      githubUrl: "https://github.com/zhangsan/utils-kit",
      period: "2019.03 - 至今",
      meta: "450 ⭐ | V 2.1.0 | MIT License",
      description:
        "UtilsKit是一套现代化的JavaScript工具库，提供了200+常用的工具函数，涵盖了字符串处理、数据校验、对象操作、日期处理、数学运算、校验等常见开发场景，使用TypeScript编写，提供完整的类型定义，支持TreeShaking按需引入。",
      features: [
        "开箱即用：链式风格、稳定、插件等200+工具函数",
        "按需引入：支持ESM模块，按需引入，可配合TreeShaking",
        "TypeScript支持：完整的类型定义，提供良好的类型安全体验",
        "无依赖：轻量级，无任何第三方库依赖，体积小",
        "测试覆盖：单元测试、集成测试等保证代码质量",
        "文档完善：每个工具函数都有详细的使用说明和示例",
      ],
      highlights: [
        "使用TypeScript编写，提供完整的类型定义，类型友好",
        "模块化封装ESModule和CommonJS两种引入方式，支持Tree Shaking，按需引入",
        "有完整的单元测试覆盖率，测试覆盖率90%以上",
        "性能优化：关注代码执行效率，注重库的打包体积",
      ],
      contributions: [
        "项目创始人，负责整体设计和核心功能开发",
        "建立完善的代码规范和代码审查流程",
        "支持完善的CI/CD流程，保证发布流程的自动化和可靠性",
        "目前被超过1000个项目依赖，月下载量超过10万次",
      ],
    },
  ],
};
