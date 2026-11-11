<script setup lang="ts">
/**
 * 个人信息区：左侧头像 + 姓名 + 意向岗位，右侧联系方式两列。
 * 头像为空或加载失败时显示姓名首字占位，尺寸不变（避免布局跳动）。
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
  <header class="flex items-start gap-6 border-b border-gray-900 pb-3">
    <div class="flex w-28 flex-none flex-col items-center">
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
      <h1 class="mt-[7px] text-lg font-bold tracking-wide text-gray-900">
        {{ info.name }}
      </h1>
      <p class="mt-0.5 text-[10.5px] leading-[15px] tracking-wider text-gray-600">
        {{ info.title }}
      </p>
    </div>

    <dl class="grid flex-1 grid-cols-2 content-center gap-x-[22px]">
      <div
        v-for="row in metaRows"
        :key="row.label"
        class="flex items-baseline gap-2 border-b border-dotted border-gray-200 py-[3px] text-[11px] leading-4"
      >
        <dt class="w-12 flex-none text-gray-500">{{ row.label }}</dt>
        <dd class="min-w-0 break-words text-gray-800">{{ row.value }}</dd>
      </div>
    </dl>
  </header>
</template>
