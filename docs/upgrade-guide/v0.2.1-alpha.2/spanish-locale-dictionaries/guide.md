---
kind: upgrade-guide
description: "Typed client dictionary registration requires Latin American Spanish alongside English and Chinese."
---

# Include Spanish in typed client dictionaries

English | [中文](guide.zh.md)

## Change

The object overload of `LocaleRuntime.register()` requires dictionaries for `zh`, `en`, and `es-419`. Client plugins that supplied only `{ zh, en }` must add Latin American Spanish to compile against the updated `@deepseek-ai/dsh-client-locale/client` types. Per-language registration remains available for external language packs; untranslated entries follow the declared fallback chain.

## Migration

1. In each client plugin's dictionary module, add `es` with the same keys and named placeholders as `en`. Check it with `satisfies Record<keyof typeof en, string>`.
2. Register the dictionaries with `ctx.locale.register(ns, { zh, en, 'es-419': es })` inside the existing owned effect.
3. Compile the plugin, select **Español (Latinoamérica)** in Settings → General → Language, and verify its labels and interpolated messages. See the [locale reference](../../../../packages/client/locale/README.md#use-this-package) for registration and fallback behavior.
