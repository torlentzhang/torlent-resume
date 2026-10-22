import type { PersonalInfo } from "@/type/types";

/**
 * 占位/演示数据。
 * 真实简历数据放在 src/mydata/ 并已加入 .gitignore，通过 VITE_USE_REAL_DATA 切换。
 */
export const personalInfo: PersonalInfo = {
  name: "张三",
  title: "高级前端开发工程师",
  avatar: "/证件照.png",
  birthDate: "1995年06月",
  workYears: "7年",
  education: "硕士",
  phone: "138-0000-0000",
  wechat: "zhangsan888",
  email: "zhangsan@example.com",
  availableDate: "1个月内",
};
