---
name: team-audio
description: "编排音频团队：audio-director + sound-designer + technical-artist + gameplay-programmer 实现从指导到实现的完整音频管道。"
argument-hint: "[要设计音频的功能或区域]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash, Task, AskUserQuestion, TodoWrite
---

当此skill被调用时，通过结构化管道编排音频团队。

**决策点：** 在每个步骤转换时，使用 `AskUserQuestion` 向
用户呈现子代理的提议作为可选选项。在对话中写入代理的
完整分析，然后用简洁标签捕获决策。
用户必须批准才能进入下一步。

1. **读取参数** 获取目标功能或区域（例如，`combat`、
   `main menu`、`forest biome`、`boss encounter`）。

2. **收集上下文**：
   - 读取 `design/gdd/` 中该功能的相关设计文档
   - 如果存在，读取 `design/gdd/sound-bible.md` 的声音圣经
   - 读取 `assets/audio/` 中的现有音频资源列表
   - 读取该区域任何现有的声音设计文档

## 如何委派

使用Task工具将每个团队成员生成为子代理：
- `subagent_type: audio-director` — 声音身份、情感基调、音频调色板
- `subagent_type: sound-designer` — SFX规格、音频事件、混音组
- `subagent_type: technical-artist` — 音频中间件、总线结构、内存预算
- `subagent_type: gameplay-programmer` — 音频管理器、游戏玩法触发器、自适应音乐

始终在代理的提示中提供完整上下文（功能描述、现有音频资源、设计文档引用）。

3. **按顺序编排音频团队**：

### 步骤1：音频指导（audio-director）
生成 `audio-director` 代理以：
- 定义此功能/区域的声音身份
- 指定情感基调和音频调色板
- 设置音乐指导（自适应层、音轨、过渡）
- 定义音频优先级和混音目标
- 建立任何自适应音频规则（战斗强度、探索、紧张）

### 步骤2：声音设计（sound-designer）
生成 `sound-designer` 代理以：
- 为每个音频事件创建详细的SFX规格
- 定义声音类别（环境、UI、游戏玩法、音乐、对话）
- 指定每个声音的参数（音量范围、音高变化、衰减）
- 规划带触发条件的音频事件列表
- 定义混音组和闪避规则

### 步骤3：技术实现（technical-artist）
生成 `technical-artist` 代理以：
- 设计音频中间件集成（Wwise/FMOD/原生）
- 定义音频总线结构和路由
- 指定每平台音频资源的内存预算
- 规划流式 vs 预加载资源策略
- 设计任何音频反应视觉效果

### 步骤4：代码集成（gameplay-programmer）
生成 `gameplay-programmer` 代理以：
- 实现音频管理器系统或审查现有系统
- 将音频事件连接到游戏玩法触发器
- 实现自适应音乐系统（如果指定）
- 设置音频遮挡/混响区域
- 为音频事件触发器编写单元测试

4. **编译音频设计文档** 结合所有团队输出。

5. **保存到** `design/gdd/audio-[feature].md`。

6. **输出摘要** 包含：音频事件计数、估算资源计数、
   实现任务，以及团队成员之间的任何开放问题。
