<script setup lang="ts">
/**
 * 个人信息区。
 *
 * 布局用 grid 而非 flex：左右两列由同一个 grid 行拉伸，天然等高，
 * 不会再出现「右侧内容高于左侧头像列」导致的下沿参差。
 *
 * 左列：头像居中 → 姓名 → 意向岗位（靠底部对齐）
 * 右列：联系方式 3 行 × 2 列栅格
 */
import { ref } from 'vue'
import type { PersonalInfo } from '@/types'

const props = defineProps<{
  info: PersonalInfo
}>()

const avatarBroken = ref(false)

const metaRows = [
  { label: '年龄', value: props.info.age },
  { label: '工作年限', value: props.info.workYears },
  { label: '学历', value: props.info.education },
  { label: '电话', value: props.info.phone },
  { label: '邮箱', value: props.info.email },
  { label: '到岗', value: props.info.availableDate },
].filter((row) => row.value)
</script>

<template>
  <header class="classic-profile">
    <!-- 左列：头像 + 姓名 + 岗位 -->
    <div class="classic-profile__identity">
      <img
        v-if="info.avatar && !avatarBroken"
        :src="info.avatar"
        :alt="`${info.name}的头像`"
        class="h-[66px] w-[66px] rounded-full border border-gray-300 object-cover grayscale"
        @error="avatarBroken = true"
      />
      <div
        v-else
        class="flex h-[66px] w-[66px] items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-gray-500"
      >
        {{ info.name.slice(0, 1) }}
      </div>

      <h1 class="classic-profile__name">
        {{ info.name }}
      </h1>
      <p class="classic-profile__title">
        {{ info.title }}
      </p>
    </div>

    <!-- 右列：联系方式栅格 -->
    <dl class="classic-profile__meta">
      <div v-for="row in metaRows" :key="row.label" class="classic-contact-row">
        <dt class="classic-contact-label">{{ row.label }}</dt>
        <dd class="classic-contact-value">{{ row.value }}</dd>
      </div>
    </dl>
  </header>
</template>

<style scoped>
/*
 * 左右两列同属一个 grid 行，默认 align-items: stretch，
 * 两列高度恒等，底边由 .classic-profile 的 padding-bottom 统一控制。
 */
.classic-profile {
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  gap: 24px;
  align-items: stretch;
  padding-bottom: 12px;
  border-bottom: 1px solid #111;
}

/* 左列：头像顶部居中，姓名与岗位贴底，撑满整列高度 */
.classic-profile__identity {
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  justify-items: center;
  text-align: center;
}

.classic-profile__name {
  grid-row: 3;
  font-size: 17px;
  line-height: 22px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #111;
}

.classic-profile__title {
  grid-row: 4;
  margin-top: 2px;
  font-size: 10.5px;
  line-height: 15px;
  letter-spacing: 0.06em;
  color: #666;
}

/* 右列：3 行 × 2 列，行高均分，与左列同高 */
.classic-profile__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  column-gap: 22px;
  align-content: stretch;
}

.classic-contact-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 3px 0;
  border-bottom: 1px dotted #e0e0e0;
  font-size: 11px;
  line-height: 16px;
}

.classic-contact-label {
  flex: none;
  width: 48px;
  color: #888;
}

.classic-contact-value {
  min-width: 0;
  color: #222;
  overflow-wrap: anywhere;
}

@media print {
  .classic-profile {
    break-inside: avoid;
  }
}
</style>
