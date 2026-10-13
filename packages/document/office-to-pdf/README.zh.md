---
description: "通过独立发布的 LibreOffice kit 在 Host 转换 Office 文档。"
kind: "package-reference"
---

# @deepseek-ai/dsh-office-to-pdf

[English](README.md) | 中文

## 概述

在宿主计算机上将 Office 文档转换为 PDF。声明了原生 LibreOffice 引擎的目标使用原生引擎，其余目标使用 Node WASM。提供方支持 DOC、DOCX、XLS、XLSX、PPT 和 PPTX。OOXML 转换返回缺失字体名称；二进制 Office 转换返回空列表。

## 目录

- [使用此包](#use-this-package)
- [理解实现](#understand-the-implementation)
- [延伸阅读](#further-exploration)
- [模型体验](#model-experience)
- [已知限制与延后工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用此包

[Web bundle](../../bundle/web-app/README.zh.md)以 `office-to-pdf` 条目挂载此提供方。独立组合通过 `cordis.yml` 条目挂载 `@deepseek-ai/dsh-office-to-pdf`。

### Agent 文档工具

`analista-funcional` preset 挂载 `@deepseek-ai/dsh-office-to-pdf/tools`，提供 `convertir_documento` 和 `render_document`，不提供 shell、脚本运行器或软件安装。独立组合将此入口挂载在 `tools`、`fs`、`workingDirectory`、`sandboxPolicy` 和 `llm` 旁。

`convertir_documento` 接受 `entrada`、可选 `formato`（默认 `pdf`，或 `docx`）和可选 `salida`；输出必须是父目录存在的新文件。Markdown 转为含标题、强调、列表和表格的 Word 报告；PDF 导出及现有 Office 转换使用随包交付的 kit。Word 可生成 DOCX，表格和演示文稿生成 PDF。Markdown 图片、引用式链接及原始 HTML 会被拒绝，不会消失。内联链接和代码块保留为不可执行的可见文本。结果确认 `ruta`、`bytes`、`formato`、`motor` 和 `missingFonts`；创建 DOCX 不检查字体可用性。

`render_document` 接受 `file_path`、可选的新 `output_dir` 和可选的正数、一基 `pages`。PDF、Office 和 Markdown 产生 PNG 路径、字节数、尺寸、源总页数和缺失字体。工作表使用可见数据分块，不接受 `pages`。调用模型无图像能力时，在读取源之前返回 `status: skipped`。ready 只确认生成；必须用 `read_image` 检查图片后才能声明视觉检查完成。

两个工具要求本地 Agent 项目及允许写入的 Session 策略。工作目录改变后，原项目之外的路径和链接仍被拒绝。现有输出保留。输入使用有界、版本检查的快照。每次操作拥有其临时文件和转换器；取消和插件卸载等待引擎释放和清理完成。发布后的文件可能在后续取消或清理失败时保留；使用新名称重试前应检查请求的输出。

工具入口默认配置为 `maxConcurrentOperations=1`、`timeoutMs=60000`、`maxInputBytes=52428800`、`maxOutputBytes=104857600`、`maxMetadataBytes=65536`、`maxPages=32`、`dpi=144`、`maxPixels=4194304`、`maxDimension=4096`、`maxMarkdownBytes=1048576`、`maxMarkdownNodes=40000`、`maxMarkdownDepth=128`、`maxTableColumns=20`、`reportFont=Arial`。超过并发上限的请求被拒绝。输出上限覆盖完整产物或 PNG 批次，以及完整 JSON 元数据。期限请求取消；同步创建仍由字节和节点上限约束。

调用方通过 `ctx.officeToPdf.convert()` 提交已授权源的标识、版本、可选字节数、延迟的有界读取、Office 扩展名和调度优先级。源版本变化会拒绝转换。结果包含调用方拥有的 PDF 字节、缺失字体、缓存键和转换 generation；配置替换后 generation 随之改变。取消以原因为拒绝值，转换失败使用 `OfficeToPdfError`。

此 provider 依赖独立发布的 [`@deepseek-ai/libreoffice-kit`](https://github.com/deepseek-ai/dsh-libreoffice-kit) npm API，kit 版本为 `^0.1.5`。应用打包选择 kit 的 `optionalDependencies` 中声明的匹配原生包；目标没有声明原生包时选择 WASM。已声明的原生引擎缺失时拒绝打包，不会选择 WASM。[发布归属决策](../../../.agents/notes/implemented/architecture/2026-09-14-independent-libreoffice-kit.zh.md)定义独立 kit 与 Harness 各自的职责。

浏览器通过 `officeToPdf.render` Remote 方法请求 PDF，参数为 Session 标识、Office 路径和优先级。此入口使用 `workspaceFiles` 完成授权和源版本检查，再通过 `fs.readBytes` 在转换预留容量内读取原始字节。进程内 `convert()` 不要求这些服务。响应保留源文件路径与版本，通过二进制 Remote 的 multipart 传输携带原生 PDF 字节，并携带缺失字体和转换 generation。`officeToPdf.generation` Remote 方法返回当前提供方 generation；`api/remotes` 负责挂载生成的 Client 描述符。

| 字段 | 默认值 | 含义 |
|---|---|---|
| `maxConcurrentConversions` | `2` | 最大活跃转换器数量；排队调用仍可取消。 |
| `timeoutMs` | `60000` | 获取转换器后的转换期限。 |
| `maxInputBytes` | `52428800` | 最大源字节数。 |
| `maxOutputBytes` | `104857600` | 最大完整 PDF 字节数。 |
| `maxImageResolution` | `192` | 最大光栅图像 DPI；覆盖 kit 的默认值 `144`。 |
| `fontFallbacks` | kit 默认值 | 有序字体族优先组；每组至少包含两个含非空白字符的名称。 |

[配置目录](../../../docs/config-catalog.zh.md#deepseek-aidsh-office-to-pdf)定义全部字体、归档和图像设置。`fontDirectories` 接受绝对目录；省略时使用 kit 的平台默认值。显式 `fontFallbacks` 替换 kit 的默认分组。已安装的请求字体仍优先使用，缺失字形仍可由其他系统字体提供。原生引擎可能在应用这些优先规则前选中已安装的度量兼容字体。

[有界转换决策](../../../.agents/notes/implemented/architecture/2026-09-15-bounded-office-conversion.zh.md)说明队列准入、缓存限额与共享取消的设计依据。

提供方按转换 generation、Office 扩展名和精确源字节的 SHA-256 保留成功 PDF。有界的源版本索引在授权 stat 后避免重读已知内容；内容标识也会在不同源路径之间共享转换。达到任一保留上限时，最近最少使用的 PDF 及其别名一同移除。不保留失败或超过缓存上限的结果。每个结果具有独立的 PDF 与字体缓冲区。已就绪别名命中不占用读取方名额；同一源的最后一个读取方离开时，立即释放其在途定位信息。源的最后一个读取方取消后，再次打开该源会重新读取字节，再按内容摘要共享转换，即使其他源仍保持该转换运行或其 PDF 已就绪。

准入在调用源读取前限制排队元数据、未完成读取方、活动源字节预留和转换。未知源大小预留 `maxInputBytes`；已知大小预留 stat 字节数。读取收到该容量，最多额外读取一个超限哨兵字节。`maxSourceBytes` 必须覆盖 `maxInputBytes`。最后一个读取方额度预留给前台。`maxBackgroundConversions` 设为零时，拒绝后台读取方加入排队或运行中的工作；仍可命中已完成的别名缓存。只要仍有前台任务排队，后台任务就继续等待，包括前台正在等待源容量的情况。前台加入会提升排队预热；最后一个前台读取方离开后，排队任务恢复后台优先级，符合条件的工作可立即开始。前台准入也可移除排队推测工作。总并发大于一时，后台并发为前台保留一个槽位。正在运行的预热即使被提权，也保留后台准入槽位直至结束。最后一个读取方取消共享工作。移除排队的前台阻塞任务后，其他符合条件的工作立即准入；实际读取、转换和清理完成前仍保留活动预留容量。

默认保留 8 个 PDF、128 MiB 和 64 个源别名，准入 32 个读取方与 8 个排队任务，最多预留 100 MiB 源字节，并允许一个后台转换。这些限制约束拥有的请求和二进制载荷，不约束引擎 RSS、multipart 封装、调用方保留的结果或 PDF.js 页面渲染。

-----

<a id="understand-the-implementation"></a>
## 理解实现

<details>
<summary>实现内部细节 — 点击展开</summary>

引擎元数据无效、必需资源缺失和转换错误会拒绝请求，不会切换引擎。共享的 WASM 引擎使用 LibreOffice 的 CPU 图像过滤器。原生转换使用独立的平台引擎。

每个并发槽按需创建并复用一个 kit 转换器。提供方将已授权输入写入私有临时目录，读取有大小上限的普通 PDF 文件，并在完成前删除目录。取消已准入的读取方不会阻塞后续排队工作。读取方取消只会释放该读取方；最后一个读取方和提供方卸载会取消共享工作。卸载向未完成读取方报告 `unavailable`，并等待转换及转换器清理结束。

Remote 文件读取在查询转换缓存前重新检查内容读取授权和源版本。延迟读取在取得转换容量后执行，并在读取后验证源版本。源读取失败直接传递；转换失败返回 `document-render/failed` 及分类原因，不暴露引擎诊断。卸载会取消并等待授权读取、Remote 请求和转换工作全部结束。

</details>

-----

<a id="further-exploration"></a>
## 延伸阅读

- [Office 转 PDF](../../../docs/subsystems/office-to-pdf.zh.md) — 组合与输入、结果所有权。
- [工作区文件](../../api/workspace-files/README.zh.md) — Session 文件授权与有界读取。

-----

<a id="model-experience"></a>
## 模型体验

### 文档工具 Schema

#### What the model sees

可选入口的 Schema 见[工具目录](../../../docs/tool-catalog.zh.md#deepseek-aidsh-office-to-pdftools)。转换报告产物元数据；渲染报告所选图片路径或明确的 skipped 结果。字节转换提供方不贡献模型上下文。

#### Token effect

两个 Schema 仅存在于挂载工具入口的作用域中。结果保留有界元数据，不包含源文本或二进制输出。

#### KV Cache effect

工具 Schema 在已挂载 preset 中保持稳定；改变工具组合会替换该上下文。操作结果通过普通工具结果追加。

## 已知限制与延后工作

<a id="known-limitations-and-deferred-work"></a>

- 转换保真度和已安装的原生/WASM 资产由 `@deepseek-ai/libreoffice-kit` 负责；此提供方不查找系统 LibreOffice，也不在运行时下载引擎。
- `timeoutMs` 仅在 kit 开始转换时计时，不限制队列等待时间。
- 工具授权及 kit 控制不构成防御原生引擎漏洞或其他进程并发替换目录的操作系统沙箱。kit 禁用宏、文档更新和 LOK 网络主机访问；这些工具不接受任意命令。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者工作上下文 — 点击展开</summary>

无。

</details>
