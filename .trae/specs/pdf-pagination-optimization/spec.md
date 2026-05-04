# 简历 PDF 分页优化 Spec

## Why
当前简历导出 PDF 时，如果内容超出单页，浏览器会直接截断内容，导致样式难看且信息不完整。需要实现智能分页，确保内容按语义区块（如工作经历、项目经历）进行分页，避免在区块中间截断。

## What Changes
- 使用 `window.print()` 配合 CSS `@page` 和 `page-break-*` 实现智能分页
- 对语义区块（教育背景、工作经历、项目经历、开源项目）设置 `break-inside: avoid`，避免在区块中间截断
- 当区块无法在当前页容纳时，自动将其整体移动到下一页
- 移除手动页码显示（使用浏览器自动生成的页码）

## Impact
- 受影响的功能：PDF 导出
- 受影响文件：
  - `src/style.css`（打印样式优化）
  - `src/components/ResumePage*.vue`（组件结构可能需要调整）

## ADDED Requirements

### Requirement: 智能分页控制
系统 SHALL 在导出 PDF 时自动进行智能分页，确保：
1. 每个语义区块（如工作经历条目）不会被截断
2. 区块完整地保持在同一页，或整体移动到下一页
3. 分页位置符合阅读习惯（优先在区块之间分页）

#### Scenario: 内容超出单页
- **WHEN** 用户点击导出 PDF，且内容超出单页
- **THEN** 系统在语义区块之间进行分页，每个区块保持完整不被截断

#### Scenario: 区块无法容纳在当前页
- **WHEN** 某个语义区块（如一个工作经历条目）无法完整容纳在当前页底部
- **THEN** 系统自动将该区块整体移动到下一页开始

### Requirement: 打印样式适配
系统 SHALL 提供优化的打印样式，确保：
1. A4 纸张尺寸正确（210mm x 297mm）
2. 页边距适合打印
3. 背景色和标签样式在打印时正常显示

#### Scenario: 打印背景色
- **WHEN** 用户导出 PDF 并包含彩色标签
- **THEN** 标签背景色在 PDF 中正常显示，不丢失

## MODIFIED Requirements
- 无

## REMOVED Requirements
- 无
