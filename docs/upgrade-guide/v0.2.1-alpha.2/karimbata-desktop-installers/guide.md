---
kind: upgrade-guide
description: Desktop application names and unsigned Windows configuration change for Karimbata Harness.
---

# Karimbata Harness desktop installers

English | [中文](guide.zh.md)

## Change

Desktop installers, shortcuts, native menus, and executable names use `Karimbata Harness`. Artifact names begin with `karimbata-harness-` instead of `deepseek-harness-`. Unsigned Windows builds ignore `.env.windows` and inherited release settings, use application ID `com.karimbata.harness`, and omit automatic updates and mandatory-update policy queries. Unsigned macOS builds use the same application ID. Signed release configuration still comes from the platform dotenv file.

Changing the unsigned application ID creates a separate installation registration. The packaged application name selects the `Karimbata Harness` Electron browser-data directory. Harness sessions and credentials remain in the existing Harness home (`~/.dsh` by default). The Windows installer installs for the current user without elevation and supports Spanish, English, and Simplified Chinese.

## Migration

1. Close the previous desktop app before installing. Remove the old installation if it is no longer needed; its uninstaller retains the Harness home. Do not copy credentials into the installer.
2. Update scripts that reference `DeepSeek Harness.exe`, `DeepSeek Harness.app`, or the artifact prefix to use `Karimbata Harness.exe`, `Karimbata Harness.app`, and `karimbata-harness-`.
3. On Windows x64, run `pnpm run package:desktop:win:x64:unsigned --check`, then `pnpm run package:desktop:win:x64:unsigned`. No `.env.windows`, signing certificate, or update service is required for this local build. The manual Windows Actions workflow requires only the build version input.
4. Open the generated EXE in `apps/desktop/.desktop-build/targets/win-x64/unsigned-artifacts/`, install, and select a local project folder. Configure API credentials separately under Settings → Models. Unsigned builds require manual installation of subsequent versions; signed distribution remains a separate release operation.
