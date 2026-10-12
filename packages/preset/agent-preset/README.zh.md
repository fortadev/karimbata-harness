---
description: "在普通 Cordis YAML 中定义 Agent 的子插件列表。可同时声明多个 preset，由会话选择。声明会提前加载，修改只影响之后创建的 Agent。"
kind: "package-reference"
---

# @deepseek-ai/dsh-agent-preset

[English](README.md) | 中文

## 概述

在普通 Cordis YAML 中定义 Agent 的子插件列表。可同时声明多个 preset，由会话选择。声明会提前加载，修改只影响之后创建的 Agent。

## 目录

- [使用此包](#use-this-package)
- [理解实现](#understand-the-implementation)
- [延伸阅读](#further-exploration)
- [模型体验](#model-experience)
- [已知限制与待办](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用此包

```yaml
- id: agent-preset-registry
  name: '@deepseek-ai/dsh-agent-preset-registry'
  config:
    default: standard
- id: preset-standard
  name: '@deepseek-ai/dsh-agent-preset'
  config:
    id: standard
    plugins: []
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `id` | 必填 | 稳定的 preset 标识符 |
| `plugins` | 必填 | 子插件行列表 |
| `name` | 未设置 | 展示名称 |
| `description` | 未设置 | 展示说明 |
| `order` | 未设置 | 列表排序 |

声明行的 `id` 是 Loader 编辑地址；`config.id` 是会话保存的 preset 标识符。子插件可省略行 ID，由 Loader 分配。

本包还随包出货创造模式通过 `skill-filesystem` 挂载的 `skills/` 目录：`agent-experience`（工具描述与高效上下文加载）、`cordis-plugin-development`（简短流程，配合按需读取的 `references/` 与可复制的 `templates/` 组合包）、`editing-cordis-compositions`，以及 `cordis-composition-reference`，后者的 `references/packages.md` 由 `scripts/gen-plugin-packages.ts` 生成并在 `doc-sync` 中做新鲜度门禁。两个流程 skill 让 agent 先读检查结果，再读 `Config.listConfigs` 报告的 `packageDir` 下的包 README，最后读构建后的 `lib/` 或 checkout 源码。`skills/` 下每个创造模式 `SKILL.md` 作为 `skill` 工具结果渲染后都保持在 8192 字符阈值之下，标准 preset 的工具结果修剪器超过该阈值才会裁剪。

在 [skills/agent-experience/SKILL.md](skills/agent-experience/SKILL.md) 编辑 `agent-experience`。仓库发现路径 `.agents/skills/agent-experience/SKILL.md` 是指向该文件的相对符号链接；发布包包含普通文件。

本包还在 `karimbata-skills/` 下包含 [Karimbata 分析师资源](karimbata-skills/analista-funcional/SKILL.md)，仅由[功能分析 preset](../../bundle/web-app/README.zh.md#per-session-agent-setup) 挂载。这些生成的西班牙语资源保留源版本和草稿状态。应修改其所属的 Desarrollo Agéntico 仓库，并一起同步生成文件。导入的 CORE 文档中的路径指向原始 FORTALEZACORE 检出目录；本包不包含该应用的源文件。

<a id="understand-the-implementation"></a>
## 理解实现

<details>
<summary>实现细节 — 点击展开</summary>

[index.ts](src/index.ts) 注册定义并把清理函数交给 Cordis。插件的 group 标记保留子配置中的 `!!js`，直到对应子插件加载时才求值。代际持有与释放由 [注册表](../agent-preset-registry/README.zh.md) 管理。

</details>

<a id="further-exploration"></a>
## 延伸阅读

- [Scope](../../core/scope/README.zh.md) — 注册隔离。
- [Agent](../../core/agent/README.zh.md) — 会话运行时。
- [Cordis](../../../docs/cordis-primer.zh.md) — 插件配置与生命周期。

<a id="model-experience"></a>
## 模型体验

通过声明的插件间接影响模型，这些插件拥有模型可见工具和提示词。

#### KV Cache effect

同一 Agent 的组合保持稳定；新 Agent 可使用更新后的定义。

## 已知限制与待办

<a id="known-limitations-and-deferred-work"></a>

- 需要 `agentPresets` 服务。重复的 preset ID 会导致声明加载失败。声明不提供目录、文件复制或文件删除操作。
- 从仓库发现 `agent-experience` 要求 checkout 启用符号链接。设置 `core.symlinks=false` 时，Git 会将链接目标写成纯文本，而不是 skill。创造模式使用包内的普通文件，不依赖该别名。
- 导入的分析师参考资料仍是草稿：配置档索引使用旧目录布局，通用配置档和 Jira 计划指南引用了过时的范围章节编号。请使用包内的 `references/perfiles/<id>.md` 文件和 `references/plantilla-alcance-funcional.md` 中的章节标题；同步前应在源仓库修正这些引用。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者工作上下文 — 点击展开</summary>

无。

</details>
