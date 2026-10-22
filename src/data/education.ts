import type { Education } from "@/type/types";

/**
 * 占位/演示数据。
 * 真实简历数据放在 src/mydata/ 并已加入 .gitignore，通过 VITE_USE_REAL_DATA 切换。
 */
export const education: Education[] = [
  {
    school: "清华大学",
    major: "计算机科学与技术 - 硕士",
    period: "2017.09 - 2020.06",
    location: "北京",
    highlights: [
      "专业排名：前 5%，获得国家奖学金、一等奖学金多次",
      "研究方向：前端性能优化、低代码平台开发",
      "发表论文：在国内核心期刊发表《前端工程化实践与性能优化》相关论文 2 篇",
    ],
  },
];
