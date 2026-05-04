# Checklist

## CSS 打印分页样式
- [x] `@page` 规则中 A4 尺寸和页边距设置正确
- [x] `.resume-page` 设置了 `break-inside: avoid` 和 `page-break-inside: avoid`
- [x] 工作经历条目（`.work-experience-item` 或类似选择器）设置了 `break-inside: avoid`
- [x] 项目经历条目设置了 `break-inside: avoid`
- [x] 区块之间允许自然的分页位置

## 功能验证
- [x] 导出 PDF 时，区块不会被截断显示
- [x] 区块完整地保持在同一页，或整体移动到下一页
- [x] 背景色和标签样式在 PDF 中正常显示
