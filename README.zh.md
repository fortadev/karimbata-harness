# Karimbata Harness

[Español (Latinoamérica)](README.md) | 中文

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="apps/desktop/resources/karimbata-logo-dark.svg">
  <img src="apps/desktop/resources/karimbata-logo.svg" alt="Grupo Karimbatá 标志" width="120">
</picture>

**Karimbata Harness 是 Grupo Karimbatá 的 AI agent harness（智能体框架）。** 用户可以通过 Web 或桌面界面与 AI 模型对话，并处理本地项目和文件。

本仓库改编自 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)，原项目由 [DeepSeek AI](https://deepseek.com) 开发。本项目保留基于 [Cordis](https://github.com/cordiverse/cordis) 的插件架构，并加入 Grupo Karimbatá 的视觉标识、拉丁美洲西班牙语，以及独立的 AI 提供商和模型选择控件。

## 功能

- **AI 提供商和 AI 模型：** 输入请求的区域提供两个独立选择器。模型选择器只显示所选提供商的模型。
- **通过 API 使用模型：** 支持 DeepSeek，以及 Kimi、OpenAI（GPT 模型）和 Anthropic（Claude 模型）等可配置提供商，具体取决于凭据和可用模型。
- **本地项目：** 选择工作目录后，智能体可以读取和编辑文件、执行命令并协助处理项目任务。
- **对话和任务：** 支持持久化会话、规划、向其他智能体委派任务和执行跟踪。
- **自适应界面：** 提供明暗主题、Grupo Karimbatá 视觉标识，以及拉丁美洲西班牙语、英语和简体中文。
- **插件扩展：** 可以组合工具和能力，无需修改智能体核心。

## 工作方式

Harness 在启动它的计算机上运行智能体及其工具。AI 提供商通过 API 接收请求并返回响应；harness 根据响应继续对话，或执行权限配置允许的工具。

选择项目后，智能体在其本地目录中工作。发送给提供商的请求可能包含指令、消息和任务所需的文件片段。在处理敏感信息或授权文件操作之前，请阅读[安全说明](SAFETY.zh.md)。

## 预览版本

Karimbata Harness 正在积极开发，功能或插件 API 可能出现破坏兼容性的变更。

<a id="run"></a>

## 安装与运行

从源代码编译时需要 Git、Node.js 22（22.19 起）或 Node.js 24 及以上版本，以及 pnpm 11.28.5。运行此改编版本时，请使用本仓库的代码。

<a id="run-from-source"></a>

### Windows 安装程序（测试）

桌面安装程序支持在 Windows x64 上运行 Karimbata Harness，并使用各设备的本地文件夹。应用仅为当前用户安装，并内置运行环境；收到 EXE 的用户无需安装 Git、Node.js 或 Python。

在 Windows 上从已准备好的仓库副本生成安装包时运行：

```sh
pnpm run package:desktop:win:x64:unsigned --check
pnpm run package:desktop:win:x64:unsigned
```

EXE 保存在 `apps/desktop/.desktop-build/targets/win-x64/unsigned-artifacts/`。此测试版本无需更新服务器，后续版本通过手动安装新 EXE 更新。安装程序支持西班牙语，并使用 Karimbata Harness 品牌。API 密钥在安装后配置，不随 EXE 分发。Active Directory 或 Entra ID 登录和企业 API 中间服务尚未集成。构建与验证要求见 [Windows 安装程序指南](apps/desktop/README.zh.md#unsigned-windows-test-installer)。

### 从源码运行

```sh
git clone https://github.com/fortadev/karimbata-harness.git
cd karimbata-harness
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm run build` 生成运行应用所需的产物。`pnpm dsh web` 使用这些产物启动 Web 界面，不会重新构建。

本机启动时，应用会打开浏览器，默认地址为 `http://127.0.0.1:3080`。终端会显示访问地址。传入 `--no-open` 可启动服务而不打开浏览器；通过 SSH 启动时会打印地址，由客户端管理访问。更多信息见 [Web 界面指南](docs/user/guide/index.zh.md)。

如需使用桌面应用，请参阅[桌面指南](apps/desktop/README.zh.md)。

## 配置 AI 提供商和模型

1. 打开 **设置 → 模型**，使用有效 API 密钥配置提供商。也可以在该页面添加其他提供商。
2. 选择或添加项目目录作为工作区。
3. 在输入区域打开 **AI 提供商**选择器，选择一个可用提供商。
4. 打开模型选择器，选择该提供商的一个模型。如果模型支持推理级别，可以在其菜单中调整。
5. 输入并发送请求，开始任务。

切换到其他提供商时，harness 会选择它的第一个可用模型及其默认推理级别。之后可以更改模型。选择从下一次请求开始生效；正在执行的步骤保留启动时的选择。

显示的提供商和可用模型取决于各安装环境的配置。API 密钥在仓库之外配置，不包含在代码或应用资源中。用量和计费归属于所使用的提供商账号。可用选项见[提供商配置指南](docs/user/guide/providers.zh.md)。

## 界面语言

打开 **设置 → 通用设置 → 语言**，选择 **Español (Latinoamérica)**。应用也可以根据系统或浏览器语言自动选择该语言。

## 开发与贡献

[开发指南](docs/development.zh.md)介绍环境和工作命令。[架构文档](docs/architecture.zh.md)介绍 harness 及其插件的组合方式。这些指南保留原项目的英文和中文技术文档。

参与贡献请参阅 [CONTRIBUTING.md](CONTRIBUTING.zh.md)，开发智能体请遵循 [AGENTS.md](AGENTS.md)。

## 支持

此改编版本的代码和更新见 [Karimbata Harness 仓库](https://github.com/fortadev/karimbata-harness)。有关原项目的问题，可以使用 [DeepSeek Harness Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions)。分享问题时，请提供复现步骤，不要公开 API 密钥或机密信息。

## 致谢

原项目 DeepSeek Harness 由 DeepSeek AI 开发。Cordis 架构参见论文 [_A Programming Paradigm for Spatiotemporal Composability_](https://arxiv.org/abs/2608.25512)。

原项目的参考文献：

```bibtex
@misc{deepseek-harness2026,
  title={DeepSeek Harness: Everything is a Plugin},
  author={DeepSeek-AI},
  year={2026},
  publisher={GitHub},
  howpublished={\url{https://github.com/deepseek-ai/deepseek-harness}},
}
```

## 许可证

本仓库保留原项目的 [MIT 许可证](LICENSE)。第三方依赖及其许可证见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
