<script setup lang="ts">
/**
 * 单条 bullet。根节点是 li，由父级 ul 提供列表语义。
 * 项目符号由 uno `bullet` shortcut 的 before: 伪元素生成，打印时不跨页。
 */
defineProps<{
  text: string
}>()
</script>

<template>
  <li class="bullet">
    {{ text }}
  </li>
</template>
