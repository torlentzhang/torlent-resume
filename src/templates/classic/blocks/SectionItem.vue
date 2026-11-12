<script setup lang="ts">
/**
 * 版块内的一个条目：条目头 + 可选概述 + 要点列表。
 * 教育 / 工作 / 项目 / 作品集共用这一种渲染，数据结构由 SectionItem 统一。
 */
import type { SectionItem } from '@/types'
import SectionItemHead from './SectionItemHead.vue'
import Bullet from './Bullet.vue'

defineProps<{
  item: SectionItem
}>()
</script>

<template>
  <div class="section-item-block">
    <SectionItemHead
      :title="item.title"
      :subtitle="item.subtitle"
      :period="item.period"
      :location="item.location"
      :url="item.url"
      :tags="item.tags"
      :tech-stack="item.techStack"
    />

    <p v-if="item.description" class="bullet mt-1">{{ item.description }}</p>

    <ul v-if="item.items.length" class="mt-1 space-y-1">
      <Bullet v-for="(text, index) in item.items" :key="index" :text="text" />
    </ul>
  </div>
</template>
