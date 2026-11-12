<script setup lang="ts">
/**
 * 个人信息区。
 *
 * 布局用 grid 而非 flex：左右两列由同一个 grid 行拉伸，天然等高，
 * 不会再出现「右侧内容高于左侧头像列」导致的下沿参差。
 *
 * 左列：头像居中 → 姓名 → 意向岗位（靠底部对齐）
 * 右列：联系方式 3 行 × 2 列栅格
 *
 * 所有样式来自 uno shortcuts：profile-* / contact-*，组件内无 style 块。
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
  <header class="profile-grid">
    <!-- 左列：头像 + 姓名 + 岗位 -->
    <div class="profile-identity">
      <img
        v-if="info.avatar && !avatarBroken"
        :src="info.avatar"
        :alt="`${info.name}的头像`"
        class="profile-avatar"
        @error="avatarBroken = true"
      />
      <div v-else class="profile-avatar-fallback">
        {{ info.name.slice(0, 1) }}
      </div>

      <h1 class="profile-name">
        {{ info.name }}
      </h1>
      <p class="profile-role">
        {{ info.title }}
      </p>
    </div>

    <!-- 右列：联系方式栅格 -->
    <dl class="profile-meta">
      <div v-for="row in metaRows" :key="row.label" class="contact-row">
        <dt class="contact-label">{{ row.label }}</dt>
        <dd class="contact-value">{{ row.value }}</dd>
      </div>
    </dl>
  </header>
</template>
