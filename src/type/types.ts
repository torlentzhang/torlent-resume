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

/** 个人项目（暂未接入简历，见 src/mydata/personal-projects.ts） */
export interface PersonalProject {
  name: string;
  period?: string;
  status: string;
  tags: string[];
  description: string;
  accessModel: string[];
  terminals: { name: string; items: string[] }[];
  architecture: { layer: string; detail: string }[];
  techStack: string[];
  highlights: string[];
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

export interface PersonalInfo {
  name: string;
  title: string;
  avatar: string;
  birthDate: string;
  workYears: string;
  education: string;
  phone: string;
  wechat: string;
  email: string;
  availableDate: string;
}

export interface PersonalSkills {
  frontend: string[];
  frameworks: string[];
  engineering: string[];
  other: string[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  personalSkills: PersonalSkills;
  languages: Language[];
  education: Education[];
  advantages: string[];
  workExperience: WorkExperience[];
  projects: Project[];
  openSource: OpenSourceProject[];
}
