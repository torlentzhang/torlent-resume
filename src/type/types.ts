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
