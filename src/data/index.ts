import type { ResumeData } from "@/types";

/*
 * 数据入口。
 *
 * 仓库内 src/data/ 只存放占位/演示数据（可安全提交）。
 * 真实简历数据放在 src/mydata/（数据文件已加入 .gitignore，不会上传）。
 *
 * 切换方式：在 .env.local 中设置 VITE_USE_REAL_DATA=true。
 * 若该开关为 true 但真实数据文件缺失（例如他人克隆仓库），自动回退到演示数据。
 */
import { personalInfo as demoPersonalInfo } from "./personal-info";
import { personalSkills as demoPersonalSkills } from "./personal-skills";
import { languages as demoLanguages } from "./languages";
import { education as demoEducation } from "./education";
import { advantages as demoAdvantages } from "./advantages";
import { workExperience as demoWorkExperience } from "./work-experience";
import { projects as demoProjects } from "./projects";
import { portfolio as demoPortfolio } from "./portfolio";

import { hasRealData, realData } from "@/mydata";

const useRealData = import.meta.env.VITE_USE_REAL_DATA === "true" && hasRealData;

if (import.meta.env.VITE_USE_REAL_DATA === "true" && !hasRealData) {
  console.warn(
    "[data] VITE_USE_REAL_DATA=true 但未检测到 src/mydata/ 下的真实数据，已回退到演示数据。",
  );
}

const demo: ResumeData = {
  personalInfo: demoPersonalInfo,
  personalSkills: demoPersonalSkills,
  languages: demoLanguages,
  education: demoEducation,
  advantages: demoAdvantages,
  workExperience: demoWorkExperience,
  projects: demoProjects,
  portfolio: demoPortfolio,
};

export const resumeData: ResumeData = useRealData
  ? {
      personalInfo: realData.personalInfo!,
      personalSkills: realData.personalSkills!,
      languages: realData.languages!,
      education: realData.education!,
      advantages: realData.advantages!,
      workExperience: realData.workExperience!,
      projects: realData.projects!,
      portfolio: realData.portfolio!,
    }
  : demo;
