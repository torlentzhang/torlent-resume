# Tasks

## Task 1: 优化 CSS 打印分页样式
- [x] Task 1.1: 检查并优化 `@media print` 中的 `@page` 规则，确保 A4 尺寸和页边距设置正确
- [x] Task 1.2: 为 `.resume-page` 添加 `break-inside: avoid` 和 `page-break-inside: avoid`，防止在页面中间截断
- [x] Task 1.3: 为主要语义区块（工作经历条目、项目经历条目）添加 `break-inside: avoid`
- [x] Task 1.4: 为允许分页的位置添加 `break-after: auto`，允许但不强制的分页

## Task 2: 验证分页效果
- [x] Task 2.1: 在浏览器中测试内容较多时的分页效果
- [x] Task 2.2: 确认区块不会被截断，完整区块要么在同一页，要么移到下一页

## Task Dependencies
- Task 2 依赖 Task 1 的完成
