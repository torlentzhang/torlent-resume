import type { ResumeData } from "@/type/types";
import { personalInfo } from "./personal-info";
import { skills } from "./personal-skills";
import { languages } from "./languages";
import { education } from "./education";
import { advantages } from "./advantages";
import { workExperience } from "./work-experience";
import { projects } from "./projects";
import { openSource } from "./open-source";

export const resumeData: ResumeData = {
  personalInfo,
  skills,
  languages,
  education,
  advantages,
  workExperience,
  projects,
  openSource,
};

export { personalInfo } from "./personal-info";
export { skills } from "./personal-skills";
export { languages } from "./languages";
export { education } from "./education";
export { advantages } from "./advantages";
export { workExperience } from "./work-experience";
export { projects } from "./projects";
export { openSource } from "./open-source";
