---
name: team-combat
description: "编排战斗团队：协调game-designer、gameplay-programmer、ai-programmer、technical-artist、sound-designer和qa-tester端到端设计、实现和验证战斗功能。"
argument-hint: "[战斗功能描述]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash, Task, AskUserQuestion, TodoWrite
---

当此skill被调用时，通过结构化管道编排战斗团队。

**决策点：** 在每个阶段转换时，使用 `AskUserQuestion` 向
用户呈现子代理的提议作为可选选项。在对话中写入代理的
完整分析，然后用简洁标签捕获决策。
用户必须批准才能进入下一阶段。

## 团队组成
- **game-designer** — 设计机制，定义公式和边缘情况
- **gameplay-programmer** — 实现核心游戏玩法代码
- **ai-programmer** — 实现该功能的NPC/敌人AI行为
- **technical-artist** — 创建VFX、着色器效果和视觉反馈
- **sound-designer** — 定义音频事件、冲击声音和环境战斗音频
- **qa-tester** — 编写测试用例并验证实现

## 如何委派

使用Task工具将每个团队成员生成为子代理：
- `subagent_type: game-designer` — 设计机制，定义公式和边缘情况
- `subagent_type: gameplay-programmer` — 实现核心游戏玩法代码
- `subagent_type: ai-programmer` — 实现NPC/敌人AI行为
- `subagent_type: technical-artist` — 创建VFX、着色器效果、视觉反馈
- `subagent_type: sound-designer` — 定义音频事件、冲击声音、环境音频
- `subagent_type: qa-tester` — 编写测试用例并验证实现

始终在代理的提示中提供完整上下文（设计文档路径、相关代码文件、约束）。在管道允许的地方并行启动独立代理（例如，第3阶段代理可以同时运行）。

## 管道

### 阶段1：设计
委派给 **game-designer**：
- 在 `design/gdd/` 中创建或更新设计文档，涵盖：机制概述、玩家幻想、详细规则、带变量定义的公式、边缘情况、依赖关系、带安全范围的调整旋钮和验收标准
- 输出：完成的设计文档

### 阶段2：架构
委派给 **gameplay-programmer**（如果涉及AI则加上 **ai-programmer**）：
- 审查设计文档
- 设计代码架构：类结构、接口、数据流
- 识别与现有系统的集成点
- 输出：架构草图，包含文件列表和接口定义

### 阶段3：实现（尽可能并行）
并行委派：
- **gameplay-programmer**：实现核心战斗机制代码
- **ai-programmer**：实现AI行为（如果功能涉及NPC反应）
- **technical-artist**：创建VFX和着色器效果
- **sound-designer**：定义音频事件列表和混音注释

### 阶段4：集成
- 将游戏玩法代码、AI、VFX和音频连接在一起
- 确保所有调整旋钮都暴露且数据驱动
- 验证该功能与现有战斗系统配合工作

### 阶段5：验证
委派给 **qa-tester**：
- 从验收标准编写测试用例
- 测试设计中记录的所有边缘情况
- 验证性能影响在预算内
- 为发现的任何问题提交错误报告

### 阶段6：签署
- 收集所有团队成员的结果
- 报告功能状态：完成 / 需要工作 / 阻塞
- 列出任何未解决问题及其分配的负责人

## 输出

涵盖以下内容的摘要报告：设计完成状态、每个团队成员的实现状态、测试结果和任何开放问题。
