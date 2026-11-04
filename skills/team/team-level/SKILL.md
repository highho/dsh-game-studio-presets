---
name: team-level
description: "编排关卡设计团队：level-designer + narrative-director + world-builder + art-director + systems-designer + qa-tester 完成完整区域/关卡创建。"
argument-hint: "[关卡名称或要设计的区域]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash, Task, AskUserQuestion, TodoWrite
---

当此skill被调用时：

**决策点：** 在每个步骤转换时，使用 `AskUserQuestion` 向
用户呈现子代理的提议作为可选选项。在对话中写入代理的
完整分析，然后用简洁标签捕获决策。
用户必须批准才能进入下一步。

1. **读取参数** 获取目标关卡或区域（例如，`tutorial`、
   `forest dungeon`、`hub town`、`final boss arena`）。

2. **收集上下文**：
   - 在 `design/gdd/game-concept.md` 读取游戏概念
   - 在 `design/gdd/game-pillars.md` 读取游戏支柱
   - 在 `design/levels/` 读取现有关卡文档
   - 在 `design/narrative/` 读取相关叙事文档
   - 读取区域区域/派系的世界构建文档

## 如何委派

使用Task工具将每个团队成员生成为子代理：
- `subagent_type: narrative-director` — 叙事目的、角色、情感弧线
- `subagent_type: world-builder` — 传说上下文、环境叙事、世界规则
- `subagent_type: level-designer` — 空间布局、节奏、遭遇、导航
- `subagent_type: systems-designer` — 敌人组成、战利品表、难度平衡
- `subagent_type: art-director` — 视觉主题、调色板、光照、资源需求
- `subagent_type: qa-tester` — 测试用例、边界测试、游戏测试检查清单

始终在代理的提示中提供完整上下文（游戏概念、支柱、现有关卡文档、叙事文档）。

3. **按顺序编排关卡设计团队**：

### 步骤1：叙事上下文（narrative-director + world-builder）
生成 `narrative-director` 代理以：
- 定义此区域的叙事目的（这里发生什么故事节拍？）
- 识别关键角色、对话触发器和传说元素
- 指定情感弧线（玩家进入时、期间、离开时应该感觉如何？）

生成 `world-builder` 代理以：
- 提供该区域的传说上下文（历史、派系存在、生态）
- 定义环境叙事机会
- 指定影响此区域游戏玩法的任何世界规则

### 步骤2：布局和遭遇设计（level-designer）
生成 `level-designer` 代理以：
- 设计空间布局（关键路径、可选路径、秘密）
- 定义节奏曲线（紧张高峰、休息区、探索区）
- 放置带难度进度的遭遇
- 设计环境谜题或导航挑战
- 定义兴趣点和地标用于寻路
- 指定入口/出口点和与相邻区域的连接

### 步骤3：系统集成（systems-designer）
生成 `systems-designer` 代理以：
- 指定敌人组成和遭遇公式
- 定义战利品表和奖励放置
- 相对于预期玩家等级/装备平衡难度
- 设计任何区域特定机制或环境危害
- 指定资源分布（生命拾取、存档点、商店）

### 步骤4：视觉指导（art-director）
生成 `art-director` 代理以：
- 定义该区域的视觉主题和调色板
- 指定光照氛围和一天中的时间设置
- 列出所需艺术资源（环境道具、独特资源）
- 定义视觉地标和视线
- 指定任何特殊VFX需求（天气、粒子、雾）

### 步骤5：QA规划（qa-tester）
生成 `qa-tester` 代理以：
- 为关键路径编写测试用例
- 识别边界和边缘情况（序列破坏、软锁）
- 为该区域创建游戏测试检查清单
- 定义关卡完成的验收标准

4. **编译关卡设计文档** 将所有团队输出结合到
   关卡设计模板格式。

5. **保存到** `design/levels/[level-name].md`。

6. **输出摘要** 包含：区域概述、遭遇计数、估算资源
   列表、叙事节拍和任何跨团队依赖或开放问题。
