<script setup lang="ts">
/**
 * 个人信息区：头像 + 姓名 + 意向岗位，右侧联系方式。
 *
 * 布局用 grid 而非 flex：左右两列由同一个 grid 行拉伸，天然等高，
 * 不会出现「右侧内容高于左侧头像列」导致的下沿参差。
 *
 * 根节点是 div，不是 header —— 组件不假设自己被放在页眉位置，
 * <header> 语义由父组件（ClassicDocument.vue）提供。
 *
 * 样式：两栏布局与左列栅格只在模板里用一次，直接写工具类；
 * 联系方式行在 v-for 内复用，用 --at-apply 收在 style 里。
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
  <div class="grid grid-cols-[112px_minmax(0,1fr)] gap-6 items-stretch pb-3 border-b border-ink">
    <!-- 左列：头像 → 姓名 → 岗位，姓名与岗位贴底 -->
    <div class="grid grid-rows-[auto_1fr_auto_auto] justify-items-center text-center">
      <img
        v-if="info.avatar && !avatarBroken"
        :src="info.avatar"
        :alt="`${info.name}的头像`"
        class="w-[66px] h-[66px] rounded-full border border-gray-300 object-cover grayscale"
        @error="avatarBroken = true"
      />
      <div
        v-else
        class="flex w-[66px] h-[66px] items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-ink-faint"
      >
        {{ info.name.slice(0, 1) }}
      </div>

      <h1 class="row-start-3 text-lg font-bold tracking-name text-ink">
        {{ info.name }}
      </h1>
      <p class="row-start-4 mt-0.5 text-[10.5px] leading-[15px] tracking-role text-ink-title">
        {{ info.title }}
      </p>
    </div>

    <!-- 右列：联系方式 3 行 × 2 列。行高必须是 auto，
         被 1fr 拉高后文字仍贴行顶、下边框在行底，会呈现错位 -->
    <dl class="grid grid-cols-2 grid-auto-rows-[auto] content-center gap-x-[22px]">
      <div v-for="row in metaRows" :key="row.label" class="contact-row">
        <dt class="contact-label">{{ row.label }}</dt>
        <dd class="contact-value">{{ row.value }}</dd>
      </div>
    </dl>
  </div>
</template>

<style scoped>
/* 联系方式行在 v-for 里复用，收在这里 */
.contact-row {
  --at-apply: 'flex items-baseline gap-2 py-[3px] text-[11px] leading-4 border-b border-dotted border-rule-dotted';
}
.contact-label {
  --at-apply: 'w-12 flex-none text-ink-hint';
}
.contact-value {
  --at-apply: 'min-w-0 text-ink-deep break-anywhere';
}
</style>
