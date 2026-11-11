<script setup lang="ts">
/**
 * 通用 A4 纸张容器。
 * 只负责固定纸张尺寸与基础外观，不含溢出检测、打印分页或任何业务逻辑。
 */
const props = withDefaults(
  defineProps<{
    /** 是否保留纸张内边距（默认保留） */
    padding?: boolean
  }>(),
  { padding: true },
)
</script>

<template>
  <div class="a4-sheet" :class="{ 'a4-sheet--no-padding': !props.padding }">
    <slot />
  </div>
</template>

<style scoped>
.a4-sheet {
  width: var(--a4-width);
  height: var(--a4-height);
  padding: var(--a4-padding);
  box-sizing: border-box;
  background-color: #fff;
  overflow: hidden;
}

.a4-sheet--no-padding {
  padding: 0;
}
</style>
