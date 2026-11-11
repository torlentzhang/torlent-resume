<script setup lang="ts">
/**
 * 单条 bullet。根节点是 li，由父级 ul 提供列表语义。
 * 不带宽高、不带纵向 margin，间距由父级控制。
 */
defineProps<{
  text: string
}>()
</script>

<template>
  <li class="classic-bullet">
    {{ text }}
  </li>
</template>
