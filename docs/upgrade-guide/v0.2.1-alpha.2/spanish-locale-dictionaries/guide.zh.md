---
kind: upgrade-guide
description: "带类型的客户端字典注册要求在英文和中文之外提供拉丁美洲西班牙语。"
---

# 在带类型的客户端字典中加入西班牙语

[English](guide.md) | 中文

## 变更

`LocaleRuntime.register()` 的对象重载要求提供 `zh`、`en` 和 `es-419` 字典。仅提供 `{ zh, en }` 的客户端插件必须加入拉丁美洲西班牙语，才能使用更新后的 `@deepseek-ai/dsh-client-locale/client` 类型编译。外部语言包仍可逐语言注册；未翻译条目遵循已声明的回退链。

## 迁移

1. 在每个客户端插件的字典模块中添加 `es`，使其键和命名占位符与 `en` 一致。使用 `satisfies Record<keyof typeof en, string>` 检查。
2. 在现有归属 effect 内使用 `ctx.locale.register(ns, { zh, en, 'es-419': es })` 注册字典。
3. 编译插件，在“设置 → 常规 → 语言”中选择 **Español (Latinoamérica)**，检查其标签及插值消息。注册与回退行为见 [locale 参考](../../../../packages/client/locale/README.zh.md#use-this-package)。
