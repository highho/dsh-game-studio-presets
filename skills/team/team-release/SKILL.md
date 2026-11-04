---
name: team-release
description: "编排发布团队：协调release-manager、qa-lead、devops-engineer和producer执行从候选到部署的发布。"
argument-hint: "[版本号 或 'next']"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash, Task, AskUserQuestion, TodoWrite
---

当此skill被调用时，通过结构化管道编排发布团队。

**决策点：** 在每个阶段转换时，使用 `AskUserQuestion` 向
用户呈现子代理的提议作为可选选项。在对话中写入代理的
完整分析，然后用简洁标签捕获决策。
用户必须批准才能进入下一阶段。

## 团队组成
- **release-manager** — 发布分支、版本控制、变更日志、部署
- **qa-lead** — 测试签署、回归套件、发布质量门
- **devops-engineer** — 构建管道、产物、部署自动化
- **producer** — 启动/不启动决策、利益相关者沟通、调度

## 如何委派

使用Task工具将每个团队成员生成为子代理：
- `subagent_type: release-manager` — 发布分支、版本控制、变更日志、部署
- `subagent_type: qa-lead` — 测试签署、回归套件、发布质量门
- `subagent_type: devops-engineer` — 构建管道、产物、部署自动化
- `subagent_type: producer` — 启动/不启动决策、利益相关者沟通

始终在代理的提示中提供完整上下文（版本号、里程碑状态、已知问题）。在管道允许的地方并行启动独立代理（例如，第3阶段代理可以同时运行）。

## 管道

### 阶段1：发布规划
委派给 **producer**：
- 确认所有里程碑验收标准已满足
- 识别此发布推迟的任何范围项目
- 设置目标发布日期并传达给团队
- 输出：带有范围确认的发布授权

### 阶段2：发布候选
委派给 **release-manager**：
- 从约定的提交切出发布分支
- 在所有相关文件中提升版本号
- 使用 `/release-checklist` 生成发布检查清单
- 冻结分支——无功能更改，仅错误修复
- 输出：发布分支名称和检查清单

### 阶段3：质量门（并行）
并行委派：
- **qa-lead**：执行完整回归测试套件。测试所有关键路径。验证无S1/S2错误。质量签署。
- **devops-engineer**：为所有目标平台构建发布产物。验证构建干净且可重现。在CI中运行自动化测试。

### 阶段4：本地化和性能
委派（如果资源可用可与第3阶段并行运行）：
- 验证所有字符串已翻译（如果可用则委派给localization-lead）
- 针对目标运行性能基准（如果可用则委派给performance-analyst）
- 输出：本地化和性能签署

### 阶段5：启动/不启动
委派给 **producer**：
- 收集签署：qa-lead、release-manager、devops-engineer、technical-director
- 评估任何开放问题——它们是阻塞性的还是可以发布？
- 做出启动/不启动决定
- 输出：带有理由的发布决策

### 阶段6：部署（如果启动）
委派给 **release-manager** + **devops-engineer**：
- 在版本控制中标记发布
- 使用 `/changelog` 生成变更日志
- 部署到暂存进行最终冒烟测试
- 部署到生产
- 发布后监控48小时

### 阶段7：发布后
- **release-manager**：生成发布报告（发布了什么、推迟了什么、指标）
- **producer**：更新里程碑跟踪，向利益相关者传达
- **qa-lead**：监控传入错误报告以查找回归
- 如果出现问题则安排发布后回顾

## 输出

涵盖以下内容的摘要报告：发布版本、范围、质量门结果、启动/不启动决策、部署状态和监控计划。
