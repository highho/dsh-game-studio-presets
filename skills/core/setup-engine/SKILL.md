---
name: setup-engine
description: "配置项目的游戏引擎和版本。在CLAUDE.md中固定引擎，检测知识差距，并在版本超出LLM训练数据时通过网络搜索填充引擎参考文档。"
argument-hint: "[engine version] 或无参数以进行引导选择"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, WebSearch, WebFetch, Task
---

当此skill被调用时：

## 1. 解析参数

三种模式：

- **完整规格**: `/setup-engine godot 4.6` — 提供引擎和版本
- **仅引擎**: `/setup-engine unity` — 提供引擎，将查找版本
- **无参数**: `/setup-engine` — 完全引导模式（引擎推荐 + 版本）

---

## 2. 引导模式（无参数）

如果没有指定引擎，运行交互式引擎选择流程：

### 检查现有游戏概念
- 如果存在则读取 `design/gdd/game-concept.md` — 提取类型、范围、平台
  目标、艺术风格、团队规模和来自 `/brainstorm` 的任何引擎推荐
- 如果没有概念，通知用户：
  > "未找到游戏概念。考虑首先运行 `/brainstorm` 来发现您想要构建什么
  > — 它也会推荐引擎。或者告诉我您的游戏，我可以帮助您选择。"

### 如果用户想在没有概念的情况下选择，询问：
1. **什么类型的游戏？**（2D、3D，还是两者？）
2. **什么平台？**（PC、移动、主机、网页？）
3. **团队规模和经验？**（单人初学者、单人有经验、小团队？）
4. **任何强烈的语言偏好？**（GDScript、C#、C++、可视化脚本？）
5. **引擎许可预算？**（仅免费，还是商业许可可以？）

### 产生推荐

使用此决策矩阵：

| 因素 | Godot 4 | Unity | Unreal Engine 5 |
|--------|---------|-------|-----------------|
| **最适合** | 2D游戏、小型3D、单人/小团队 | 移动、中等范围3D、跨平台 | AAA 3D、照片级真实感、大团队 |
| **语言** | GDScript（+ C#、C++通过扩展） | C# | C++ / 蓝图 |
| **成本** | 免费，MIT许可 | 收入门槛下免费 | 收入门槛下免费，5%版税 |
| **学习曲线** | 温和 | 中等 | 陡峭 |
| **2D支持** | 优秀（原生） | 好（但3D优先引擎） | 可能但不理想 |
| **3D质量上限** | 好（快速改进） | 很好 | 同类最佳 |
| **网页导出** | 是（原生） | 是（有限） | 否 |
| **主机导出** | 通过第三方 | 是（带许可） | 是 |
| **开源** | 是 | 否 | 源代码可用 |

呈现前1-2个推荐，理由与用户的答案相关。
让用户选择——绝不强制推荐。

---

## 3. 查找当前版本

选择引擎后：

- 如果提供了版本，使用它
- 如果没有提供版本，使用WebSearch查找最新稳定版本：
  - 搜索: `"[engine] latest stable version [current year]"`
  - 与用户确认："最新稳定版 [engine] 是 [version]。使用这个？"

---

## 4. 更新CLAUDE.md技术栈

读取 `CLAUDE.md` 并更新技术栈章节。替换
`[CHOOSE]` 占位符为实际值：

**对于Godot：**
```markdown
- **引擎**: Godot [version]
- **语言**: GDScript（主要），C++通过GDExtension（性能关键）
- **构建系统**: SCons（引擎），Godot导出模板
- **资源管道**: Godot导入系统 + 自定义资源管道
```

**对于Unity：**
```markdown
- **引擎**: Unity [version]
- **语言**: C#
- **构建系统**: Unity构建管道
- **资源管道**: Unity资源导入管道 + Addressables
```

**对于Unreal：**
```markdown
- **引擎**: Unreal Engine [version]
- **语言**: C++（主要），蓝图（游戏玩法原型）
- **构建系统**: Unreal构建工具（UBT）
- **资源管道**: Unreal内容管道
```

---

## 5. 填充技术偏好

更新CLAUDE.md后，创建或更新 `.claude/docs/technical-preferences.md` 为
引擎适当的默认值。首先读取现有模板，然后填充：

### 引擎和语言章节
- 从第4步做出的引擎选择填充

### 命名约定（引擎默认值）

**对于Godot（GDScript）：**
- 类：PascalCase（例如，`PlayerController`）
- 变量/函数：snake_case（例如，`move_speed`）
- 信号：snake_case过去时（例如，`health_changed`）
- 文件：snake_case匹配类（例如，`player_controller.gd`）
- 场景：PascalCase匹配根节点（例如，`PlayerController.tscn`）
- 常量：UPPER_SNAKE_CASE（例如，`MAX_HEALTH`）

**对于Unity（C#）：**
- 类：PascalCase（例如，`PlayerController`）
- 公共字段/属性：PascalCase（例如，`MoveSpeed`）
- 私有字段：_camelCase（例如，`_moveSpeed`）
- 方法：PascalCase（例如，`TakeDamage()`）
- 文件：PascalCase匹配类（例如，`PlayerController.cs`）
- 常量：PascalCase 或 UPPER_SNAKE_CASE

**对于Unreal（C++）：**
- 类：带前缀PascalCase（`A` 表示Actor，`U` 表示UObject，`F` 表示结构体）
- 变量：PascalCase（例如，`MoveSpeed`）
- 函数：PascalCase（例如，`TakeDamage()`）
- 布尔值：`b` 前缀（例如，`bIsAlive`）
- 文件：匹配类不带前缀（例如，`PlayerController.h`）

### 剩余章节
- 性能预算：保留为 `[TO BE CONFIGURED]` 并建议：
  > "典型目标：60fps / 16.6ms帧预算。现在设置这些吗？"
- 测试：建议引擎适当的框架（Godot用GUT，Unity用NUnit等）
- 禁止模式 / 允许库：保留为占位符

### 协作步骤
向用户呈现填充的偏好：
> "这是 [engine] 的默认技术偏好。想自定义
> 这些吗，还是我应该保存默认值？"

写入文件前等待批准。

---

## 6. 确定知识差距

检查引擎版本是否可能超出LLM的训练数据。

**已知近似覆盖范围**（随模型变化更新）：
- LLM知识截止：**2025年5月**
- Godot：训练数据可能覆盖到 ~4.3
- Unity：训练数据可能覆盖到 ~2023.x / 早期 6000.x
- Unreal：训练数据可能覆盖到 ~5.3 / 早期 5.4

将用户选择的版本与这些基线比较：

- **在训练数据内** → `低风险` — 参考文档可选但推荐
- **接近边缘** → `中等风险` — 参考文档推荐
- **超出训练数据** → `高风险` — 参考文档必需

通知用户他们属于哪个类别及原因。

---

## 7. 填充引擎参考文档

### 如果在训练数据内（低风险）：

创建最小化 `docs/engine-reference/<engine>/VERSION.md`：

```markdown
# [引擎] — 版本参考

| 字段 | 值 |
|-------|-------|
| **引擎版本** | [version] |
| **项目固定** | [今天日期] |
| **LLM知识截止** | 2025年5月 |
| **风险级别** | 低 — 版本在LLM训练数据内 |

## 注意

此引擎版本在LLM的训练数据内。引擎参考
文档是可选的，但如果agents建议错误的API可以稍后添加。

运行 `/setup-engine refresh` 以随时填充完整参考文档。
```

不要创建 breaking-changes.md、deprecated-apis.md 等——它们会
增加上下文成本而价值最小。

### 如果超出训练数据（中等或高风险）：

通过搜索网络创建完整参考文档集：

1. **搜索官方迁移/升级指南**：
   - `"[engine] [old version] to [new version] migration guide"`
   - `"[engine] [version] breaking changes"`
   - `"[engine] [version] changelog"`
   - `"[engine] [version] deprecated API"`

2. **从官方文档获取并提取**：
   - 从训练截止点到当前的每个版本之间的重大变更
   - 带替换的已弃用API
   - 新功能和最佳实践

3. **创建完整参考目录**：
   ```
   docs/engine-reference/<engine>/
   ├── VERSION.md              # 版本固定 + 知识差距分析
   ├── breaking-changes.md     # 版本间重大变更
   ├── deprecated-apis.md      # "不要使用X → 使用Y"表格
   ├── current-best-practices.md  # 训练截止后的新实践
   └── modules/                # 每子系统参考（按需创建）
   ```

4. **使用网络搜索的真实数据填充每个文件**，遵循
   现有参考文档建立的格式。每个文件必须有
   "最后验证: [日期]" 标题。

5. **对于模块文件**：仅为发生重大变更的子系统创建模块。
   不要创建空或最小化的模块文件。

---

## 8. 更新CLAUDE.md导入

更新引擎版本参考下的 `@` 导入以指向
正确的引擎：

```markdown
## 引擎版本参考

@docs/engine-reference/<engine>/VERSION.md
```

如果之前的导入指向不同的引擎（例如，从
Godot切换到Unity），更新它。

---

## 9. 更新代理指令

对于所选引擎的专业代理，验证他们是否有
"版本意识"章节。如果没有，按照现有
Godot专业代理中的模式添加一个。

该章节应指示代理：
1. 读取 `docs/engine-reference/<engine>/VERSION.md`
2. 在建议代码前检查已弃用API
3. 检查相关版本转换的重大变更
4. 使用WebSearch验证不确定的API

---

## 10. 刷新子命令

如果以 `/setup-engine refresh` 调用：

1. 读取现有的 `docs/engine-reference/<engine>/VERSION.md` 以获取
   当前引擎和版本
2. 使用WebSearch检查：
   - 上次验证后的新引擎发布
   - 更新的迁移指南
   - 新弃用的API
3. 用新发现更新所有参考文档
4. 更新所有修改文件的 "最后验证" 日期
5. 报告变更内容

---

## 11. 输出摘要

设置完成后，输出：

```
引擎设置完成
=====================
引擎:          [name] [version]
知识风险:  [低/中/高]
参考文档:  [已创建/已跳过]
CLAUDE.md:       [已更新]
技术偏好:      [已创建/已更新]
代理配置:    [已验证]

下一步：
1. 查看 docs/engine-reference/<engine>/VERSION.md
2. [如果来自 /brainstorm] 运行 /map-systems 将您的概念分解为单个系统
3. [如果来自 /brainstorm] 运行 /design-system 编写每系统GDD（引导，逐节）
4. [如果来自 /brainstorm] 运行 /prototype [core-mechanic] 测试核心循环
5. [如果是全新开始] 运行 /brainstorm 发现您的游戏概念
6. 创建您的第一个里程碑: /sprint-plan new
```

---

## 防护栏

- 绝不猜测引擎版本——始终通过WebSearch或用户确认验证
- 绝不覆盖现有参考文档而不询问——追加或更新
- 如果参考文档已为不同引擎存在，替换前询问
- 进行CLAUDE.md编辑前始终向用户显示您将要更改的内容
- 如果WebSearch返回模糊结果，向用户显示并让他们决定
