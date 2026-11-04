# 游戏工作室 · DSH Agent 预设包

把 `Claude-Code-Game-Studios` 的 48 个子智能体、37 个技能、11 阶段工作流，
提炼成 **11 套面向不同情景的 DSH agent 预设**。

```bash
git clone https://github.com/highho/dsh-game-studio-presets.git
cd dsh-game-studio-presets && node install.mjs
```

然后在 DeepSeek Harness 里把这个目录 `install_bundle` 进 profile，新建会话即用。
细节见[安装](#安装)。

## 为什么是 11 套而不是 48 套

原项目为 Claude Code 的 48 个子智能体各写了一份 `.md` 提示词。那套设计的代价是：
每个角色都要自带一遍技能正文，切换角色要先想清楚"该叫谁"，而真正的分野其实只有
**工作室的 11 个工作阶段**。

这里按「你现在处于哪个阶段」重新切分：一个总控 + 9 个阶段角色 + 1 个内部审校。
每个预设只挂它那个阶段真正需要的技能，技能正文不再重复。

## 预设清单

| order | 预设 id | 名称 | 用在什么时候 |
|---|---|---|---|
| 100 | `game-studio` | 游戏工作室 · 总控 | 入口。不确定找谁时选它，它按阶段派活 |
| 101 | `game-concept` | 概念立项 | 一个想法/一部小说，该做成什么游戏 |
| 102 | `game-design` | 系统设计 | 核心循环、公式、平衡、GDD |
| 103 | `game-build` | 程序实现 | 白盒验证、原型、正式实现 |
| 104 | `game-art-audio` | 美术音频 | 美术方向、资产审计、视听反馈 |
| 105 | `game-qa` | 测试验收 | 证据化验收：真跑、真输入、真结果 |
| 106 | `game-release` | 发布运营 | 排期、里程碑、上线清单、补丁说明 |
| 107 | `game-narrative` | 叙事文案 | 世界观、角色、分支剧情、对话 |
| 108 | `game-level` | 关卡设计 | 布局、遭遇、节奏曲线、收集品 |
| 109 | `game-engine` | 引擎专家 | Godot / Unity / Unreal 的版本与 API 问题 |
| 120 | `game-reviewer` | 审校（内部） | 被总控调用的只读审校，不单独选用 |

`game-reviewer` 排在 120 是为了让它落在阶段角色之后，并且**只被总控调用**：
它没有 Bash、没有自带技能，只做读文件和检索，用来复核别的角色的产出。

## 保留下来的是什么

这套预设没有把原项目压成"通用编程助手 + 游戏术语"。真正被逐字保留的是它的**工作方式**：

- **提问 → 方案 → 决策 → 草稿 → 批准**：每个角色在写文件前都要问
  「我可以将其写入 [文件路径] 吗？」，并先给草稿或摘要。
- **用户是创意总监，agent 是受聘的专家顾问**：agent 提方案、摆取舍，
  决定权不在它手上。
- **三级汇报**：总监 / 主管 / 专家。阶段角色知道自己该向谁升级。
- **守边界**：收到超出本阶段的请求时，说明该交给哪个预设，不越界代劳。
- **不硬重试**：工具被拒时如实报告——做完了什么、确切错误、缺哪个权限、建议下一步。

## 技能是怎么挂上去的

原项目的 37 个技能在 `.claude/skills/`，DSH **不会**扫描那个目录。因此它们被
按领域复制到 6 个桶里：

```
~/.dsh/game-studio-skills/
  core/    8 个  共性流程（start、onboard、brainstorm、gate-check…）
  team/    7 个  跨职能会诊（team-combat、team-level、team-narrative…）
  design/  3 个  设计与平衡（design-system、design-review、balance-check）
  build/   8 个  实现与工程（code-review、prototype、perf-profile…）
  ship/   10 个  排期与发布（sprint-plan、release-checklist、changelog…）
  art/     1 个  资产审计（asset-audit）
```

每个预设用 `customSkillDirs` 只挂自己那几个桶。比如 `game-release` 只看到
`core + ship`，`game-reviewer` 一个都不挂。这样角色不用在 37 个技能里挑，
上下文也不会被无关技能占满。

## 安装

分两步：先把技能部署到磁盘，再把预设挂进 profile。

### 1. 部署技能

```bash
git clone https://github.com/highho/dsh-game-studio-presets.git
cd dsh-game-studio-presets
node install.mjs
```

默认部署到 `~/.dsh/game-studio-skills/`。脚本结束会回读校验，正常应看到：

```
回读校验：37/37 个 SKILL.md 就位
```

想先看一眼再动手：

```bash
node install.mjs --dry-run
```

**换位置存技能**：设 `DSH_GAME_SKILLS` 环境变量即可，安装脚本与补丁都认它，
不用改任何文件。

```bash
# macOS / Linux
DSH_GAME_SKILLS=/opt/team-skills node install.mjs

# Windows (cmd)
set DSH_GAME_SKILLS=D:\team-skills && node install.mjs

# Windows (PowerShell)
$env:DSH_GAME_SKILLS="D:\team-skills"; node install.mjs
```

### 2. 挂载预设

在 DeepSeek Harness 里，把**克隆下来的目录绝对路径**交给 `plugin_manager`：

```
plugin_manager action=install_bundle target="<克隆下来的目录绝对路径>"
```

装完用 `plugin_manager action=list_bundles` 确认，然后在**新建会话**里选预设。

## 卸载

```bash
node install.mjs --uninstall          # 移除已部署的技能目录
```

```
plugin_manager action=remove_bundle target="@local/dsh-game-studio-presets"
```

## 已知限制

- **必须新建会话。** 改预设或技能后，已开的会话不会热更新——它们保留启动时的
  插件版本。这是 DSH 的语义，不是本包的缺陷。
- **预设行列 `active` 只证明声明层。** 子插件是惰性表达式，真正激活发生在某个
  Agent 选中该预设、组合该会话的时候。所以「列出来 active」不等于「一定可用」；
  悬停看到 `加载失败` 才是真的失败。
- **忘跑第 1 步不会报错。** 技能目录不存在时，角色照常能跑，只是看不到那批技能。
  补跑 `node install.mjs` 并新建会话即可。
- **`game-reviewer` 不建议单独选用。** 它没有终端、没有自带技能，只被
  `game-studio` 的委派工具调用。
- **`game-engine` 覆盖三个引擎。** 它第一步会去 `docs/engine-reference/` 确认
  引擎与版本。只做一个引擎的团队可以按需拆分。

## 目录说明

```
dsh-game-studio-presets/
  package.json        声明 dsh.bundle.patch 指向下面的补丁
  cordis.patch.yml    11 个 preset 声明（单个 insert 操作）
  install.mjs         技能部署脚本（--dry-run / --uninstall）
  skills/             6 个技能桶，共 37 个 SKILL.md
```

补丁的顶层是 **操作列表**，不是字典：`- insert:` 后跟行数组。
改预设时改这里的 `config`，存盘后新建会话即可生效（profile 用 `link:` 引用时），
或重新 `install_bundle` 覆盖。

## 可调的地方

- **加/减技能**：改对应 `skill-filesystem.config.customSkillDirs` 的桶列表。
- **改人设**：改 `persona.config.prefix`。每个 prefix 都带着上述协作契约，
  改的时候别把它删掉——那是这套预设和通用助手的分界线。
- **加阶段**：复制一段 `preset-*` 行，换 `id` 和 `order`，并在
  `game-studio` 的 `delegation` 里加一条对它的 `tool-subagent`。
- **引擎拆分**：`game-engine` 是一个预设覆盖三引擎，它第一步会先去
  `docs/engine-reference/` 确认引擎和版本。若你的团队只做一个引擎，
  可以把它拆成三个更专的预设。

## 关于 Windows

`game-build`、`game-qa`、`game-release`、`game-engine`、`game-studio` 这五个
需要终端的角色，配置成在 Windows 上禁用 `tool-bash`、启用 `tool-pwsh`。
其余只读角色**完全没有终端权限**——它们在设计上就不该执行命令。
