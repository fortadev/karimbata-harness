---
kind: upgrade-guide
description: Karimbatá Harness 更改桌面应用名称及 Windows 未签名构建配置。
---

# Karimbatá Harness 桌面安装包

[English](guide.md) | 中文

## 变更

桌面安装包、快捷方式和原生菜单显示 `Karimbatá Harness`。可执行文件及应用包的文件名保留不带重音符号的 `Karimbata Harness` 名称。产物名称以 `karimbata-harness-` 开头，替代 `deepseek-harness-`。Windows 未签名构建忽略 `.env.windows` 和继承的发布设置，使用应用 ID `com.karimbata.harness`，不查询自动更新或强制更新策略。macOS 未签名构建使用相同应用 ID。签名发布配置仍由平台 dotenv 文件提供。

未签名构建的应用 ID 变更会创建独立的安装注册。打包后的应用保留既有的 `Karimbata Harness` Electron 浏览器数据目录；显式选择的数据目录也予以保留。Harness 会话和凭据仍保存在既有 Harness 主目录中（默认 `~/.dsh`）。Windows 安装程序仅为当前用户安装，无需提权，支持西班牙语、英语和简体中文。

## 迁移

1. 安装前关闭旧桌面应用。不再需要旧安装时可将其卸载；卸载程序保留 Harness 主目录。不要将凭据复制到安装包中。
2. 将脚本中的 `DeepSeek Harness.exe`、`DeepSeek Harness.app` 和旧产物前缀替换为 `Karimbata Harness.exe`、`Karimbata Harness.app` 和 `karimbata-harness-`。
3. 在 Windows x64 上先运行 `pnpm run package:desktop:win:x64:unsigned --check`，再运行 `pnpm run package:desktop:win:x64:unsigned`。此本地构建不需要 `.env.windows`、签名证书或更新服务。手动 Windows Actions 工作流仅要求构建版本输入。
4. 打开 `apps/desktop/.desktop-build/targets/win-x64/unsigned-artifacts/` 下生成的 EXE，完成安装并选择本地项目文件夹。在 Settings → Models 中单独配置 API 凭据。未签名构建的后续版本需要手动安装；签名分发仍由独立的发布操作完成。
