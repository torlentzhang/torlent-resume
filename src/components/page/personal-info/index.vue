<script setup lang="ts">
import { resumeData } from "@/data";
import ResumeSheet from "@/components/page/ResumeSheet.vue";
import resumeImg from "@/mydata/简历照片.jpg";
</script>

<template>
  <ResumeSheet>
    <div class="resume-grid-cols">
      <!-- 左栏 -->
      <div class="resume-stack">
        <!-- 头像和个人信息 -->
        <div class="text-center">
          <div
            class="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-500 mb-3"
          >
            <img
              :src="resumeImg"
              alt="个人照片"
              class="w-full h-full object-cover"
              onerror="
                this.src =
                  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23165DFF%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2255%22 font-size=%2240%22 fill=%22white%22 text-anchor=%22middle%22%3E张%3C/text%3E%3C/svg%3E'
              "
            />
          </div>
          <h1 class="text-2xl font-bold text-gray-800">
            {{ resumeData.personalInfo.name }}
          </h1>
          <p class="text-blue-600 mt-1">{{ resumeData.personalInfo.title }}</p>
        </div>

        <!-- 基本信息 -->
        <div>
          <h2
            class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2"
          >
            <span class="text-blue-600">—</span>
            基本信息
          </h2>
          <div class="resume-lines text-sm">
            <div class="flex">
              <span class="text-gray-500 w-20">年龄</span>
              <span class="text-gray-700">{{
                resumeData.personalInfo.age
              }}</span>
            </div>
            <div class="flex">
              <span class="text-gray-500 w-20">工作年限</span>
              <span class="text-gray-700">{{
                resumeData.personalInfo.workYears
              }}</span>
            </div>
            <div class="flex">
              <span class="text-gray-500 w-20">学历</span>
              <span class="text-gray-700">{{
                resumeData.personalInfo.education
              }}</span>
            </div>
            <div class="flex">
              <span class="text-gray-500 w-20">电话</span>
              <span class="text-gray-700">{{
                resumeData.personalInfo.phone
              }}</span>
            </div>
            <div class="flex">
              <span class="text-gray-500 w-20">邮箱</span>
              <span class="text-gray-700">{{
                resumeData.personalInfo.email
              }}</span>
            </div>
            <div class="flex">
              <span class="text-gray-500 w-20">到岗时间</span>
              <span class="text-gray-700">{{
                resumeData.personalInfo.availableDate
              }}</span>
            </div>
          </div>
        </div>

        <!-- 专业技能 -->
        <div>
          <h2
            class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2"
          >
            <span class="text-blue-600">—</span>
            专业技能
          </h2>
          <div class="resume-fields">
            <div>
              <h3 class="text-sm font-medium text-blue-600 mb-2">前端基础</h3>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="skill in resumeData.personalSkills.frontend"
                  :key="skill"
                  class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
            <div>
              <h3 class="text-sm font-medium text-blue-600 mb-2">框架与库</h3>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="skill in resumeData.personalSkills.frameworks"
                  :key="skill"
                  class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
            <div>
              <h3 class="text-sm font-medium text-blue-600 mb-2">工程化</h3>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="skill in resumeData.personalSkills.engineering"
                  :key="skill"
                  class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
            <div>
              <h3 class="text-sm font-medium text-blue-600 mb-2">其他</h3>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="skill in resumeData.personalSkills.other"
                  :key="skill"
                  class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右栏 -->
      <div class="resume-stack">
        <!-- 教育背景 -->
        <div>
          <h2
            class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2"
          >
            <span class="text-blue-600">—</span>
            教育背景
          </h2>
          <div class="resume-fields">
            <div v-for="edu in resumeData.education" :key="edu.school">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-base font-medium text-gray-800">
                    {{ edu.school }}
                  </h3>
                  <p class="text-blue-600 text-sm">{{ edu.major }}</p>
                </div>
                <div class="text-right">
                  <p class="text-gray-500 text-sm">{{ edu.period }}</p>
                  <p class="text-gray-500 text-xs">{{ edu.location }}</p>
                </div>
              </div>
              <ul class="mt-2 resume-lines">
                <li
                  v-for="highlight in edu.highlights"
                  :key="highlight"
                  class="text-sm text-gray-600 list-disc ml-5"
                >
                  {{ highlight }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 语言能力 -->
        <div>
          <h2
            class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2"
          >
            <span class="text-blue-600">—</span>
            语言能力
          </h2>
          <div class="resume-fields">
            <div v-for="lang in resumeData.languages" :key="lang.name">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-medium text-gray-800">{{
                  lang.name
                }}</span>
                <span class="text-sm text-blue-600">{{ lang.level }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                <div
                  class="bg-blue-600 h-1.5 rounded-full"
                  :style="{ width: lang.name === '英语' ? '85%' : '55%' }"
                ></div>
              </div>
              <p class="text-xs text-gray-500">{{ lang.description }}</p>
            </div>
          </div>
        </div>

        <!-- 个人优势 -->
        <div>
          <h2
            class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2"
          >
            <span class="text-blue-600">—</span>
            个人优势
          </h2>
          <ul class="resume-lines">
            <li
              v-for="adv in resumeData.advantages"
              :key="adv"
              class="text-sm text-gray-600 list-disc ml-5"
            >
              {{ adv }}
            </li>
          </ul>
        </div>

        <!-- 工作经历 -->
        <div>
          <h2
            class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2"
          >
            <span class="text-blue-600">—</span>
            工作经历
          </h2>
          <div class="resume-fields">
            <div
              v-for="exp in resumeData.workExperience"
              :key="exp.company"
              class="work-experience-item"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-base font-medium text-gray-800">
                    {{ exp.company }}
                  </h3>
                  <p class="text-blue-600 text-sm">{{ exp.position }}</p>
                </div>
                <div class="text-right">
                  <p class="text-gray-500 text-sm">{{ exp.period }}</p>
                  <p class="text-gray-500 text-xs">{{ exp.location }}</p>
                </div>
              </div>
              <div class="mt-2 resume-fields">
                <div>
                  <p class="text-sm font-medium text-gray-700">主要职责：</p>
                  <ul class="resume-lines">
                    <li
                      v-for="resp in exp.responsibilities"
                      :key="resp"
                      class="text-sm text-gray-600 list-disc ml-5"
                    >
                      {{ resp }}
                    </li>
                  </ul>
                </div>
                <div v-if="exp.achievements.length > 0">
                  <p class="text-sm font-medium text-gray-700">工作业绩：</p>
                  <ul class="resume-lines">
                    <li
                      v-for="achievement in exp.achievements"
                      :key="achievement"
                      class="text-sm text-gray-600 list-disc ml-5"
                    >
                      {{ achievement }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ResumeSheet>
</template>

<style scoped>
/* 左右两栏：1/3 : 2/3。minmax(0,…) 防止邮箱、长英文串撑破轨道 */
.resume-grid-cols {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: 24px;
  align-items: start;
}

/* 同栏内 section 堆叠：用 gap 代替 space-y-* / mb-* 的 margin 叠加 */
.resume-stack {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 14px;
}

/* section 内字段堆叠 */
.resume-fields {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
}

/* 列表行 */
.resume-lines {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 3px;
}
</style>
