---
description: "Host Office conversion with the independently published LibreOffice kit."
kind: "package-reference"
---

# @deepseek-ai/dsh-office-to-pdf

English | [中文](README.zh.md)

## Summary

Convert Office documents to PDFs on the Host computer. Targets with a declared native LibreOffice engine use it; other targets use Node WASM. The provider accepts DOC, DOCX, XLS, XLSX, PPT, and PPTX. OOXML conversion returns missing-font names; binary Office conversion returns an empty list.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Further Exploration](#further-exploration)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

The [Web bundle](../../bundle/web-app/README.md) mounts this provider as `office-to-pdf`. Independent compositions mount `@deepseek-ai/dsh-office-to-pdf` as a `cordis.yml` row.

### Agent document tools

The `analista-funcional` preset mounts `@deepseek-ai/dsh-office-to-pdf/tools`, exposing `convertir_documento` and `render_document` without a shell, script runner or software installation. Independent compositions mount this entry beside `tools`, `fs`, `workingDirectory`, `sandboxPolicy` and `llm`.

`convertir_documento` accepts `entrada`, optional `formato` (`pdf` by default, or `docx`) and optional `salida`, a fresh file path whose parent exists. Markdown becomes a Word report with headings, emphasis, lists and tables; PDF export and existing Office conversion use the bundled kit. Word inputs can produce DOCX; spreadsheets and presentations produce PDF. Markdown images, reference links and raw HTML reject rather than disappear. Inline links and code blocks remain inert visible text. Results confirm `ruta`, `bytes`, `formato`, `motor` and `missingFonts`; DOCX authoring does not inspect font availability.

`render_document` accepts `file_path`, optional fresh `output_dir` and optional positive one-based `pages`. PDF, Office and Markdown produce PNG paths, byte sizes, dimensions, total source page count and missing fonts. Worksheets use visible-data tiling and do not accept `pages`. Without an image-capable calling model, the result is `status: skipped` before source reading. A ready result confirms generation; inspect its images with `read_image` before claiming visual review.

Both tools require a local Agent project and a writable Session policy. Paths and links outside the original project reject, including after a working-directory change. Existing outputs are preserved. Inputs use bounded, version-checked snapshots. Each operation owns scratch files and its converter; cancellation and plugin unload join engine disposal and cleanup. Already-published files can remain after a later cancellation or cleanup failure; inspect the requested output before retrying with a new name.

Tool-entry defaults are `maxConcurrentOperations=1`, `timeoutMs=60000`, `maxInputBytes=52428800`, `maxOutputBytes=104857600`, `maxMetadataBytes=65536`, `maxPages=32`, `dpi=144`, `maxPixels=4194304`, `maxDimension=4096`, `maxMarkdownBytes=1048576`, `maxMarkdownNodes=40000`, `maxMarkdownDepth=128`, `maxTableColumns=20` and `reportFont=Arial`. Excess concurrent work rejects. Output bounds cover the full artifact or PNG batch and complete JSON metadata. The deadline requests cancellation; synchronous authoring remains byte/node bounded.

Callers submit authorized source identity, version, optional byte size, a deferred bounded read, Office extension, and scheduling priority through `ctx.officeToPdf.convert()`. A changed source version rejects conversion. Results contain caller-owned PDF bytes, missing fonts, a cache key, and a conversion generation that changes on configuration replacement. Cancellation rejects with its reason; conversion failures use `OfficeToPdfError`.

The provider depends on the independently published [`@deepseek-ai/libreoffice-kit`](https://github.com/deepseek-ai/dsh-libreoffice-kit) npm API at kit version `^0.1.5`. Application packaging selects the matching native package declared in the kit’s `optionalDependencies`, or WASM when no native package is declared for that target. A missing declared native engine rejects packaging without selecting WASM. The [release ownership decision](../../../.agents/notes/implemented/architecture/2026-09-14-independent-libreoffice-kit.md) defines the independent kit and Harness responsibilities.

Browsers request PDFs through the `officeToPdf.render` Remote method with a Session identity, Office path, and priority. This entry uses `workspaceFiles` for authorization and source versions, then reads raw bytes through `fs.readBytes` within the conversion reservation. In-process `convert()` does not require those services. Responses retain the source path and version and carry native PDF bytes through the binary Remote multipart transport, plus missing fonts and conversion generation. The `officeToPdf.generation` Remote method returns the current provider generation; `api/remotes` mounts the generated Client descriptor.

| Field | Default | Meaning |
|---|---|---|
| `maxConcurrentConversions` | `2` | Maximum active converters; queued calls remain cancellable. |
| `timeoutMs` | `60000` | Conversion deadline after a converter is acquired. |
| `maxInputBytes` | `52428800` | Maximum source bytes. |
| `maxOutputBytes` | `104857600` | Maximum complete PDF bytes. |
| `maxImageResolution` | `192` | Maximum raster-image DPI; overrides the kit default of `144`. |
| `fontFallbacks` | Kit defaults | Ordered font-family preference groups; each group requires at least two names containing non-whitespace characters. |

The [configuration catalog](../../../docs/config-catalog.md#deepseek-aidsh-office-to-pdf) owns the full font, archive, and image settings. `fontDirectories` accepts absolute directories; omission uses the kit platform defaults. Explicit `fontFallbacks` replaces the kit's default groups. Installed requested fonts retain precedence, and other system fonts remain eligible for uncovered glyphs. Native engines can select installed metric-compatible fonts before these preferences.

The [bounded conversion decision](../../../.agents/notes/implemented/architecture/2026-09-15-bounded-office-conversion.md) explains queue admission, cache limits, and shared cancellation.

The provider retains successful PDFs by converter generation, Office extension, and SHA-256 of the exact source bytes. A bounded source-version index avoids rereading known content after an authorized stat; content identity also shares conversion across different source paths. Least-recently-used PDFs leave at either retention limit, together with their aliases. Failures and oversized cache entries are not retained. Every result has independent PDF/font buffers. Ready alias hits consume no reader slot; active source locators are released when their last reader leaves. Reopening a source after its final reader cancels rereads its bytes before sharing by digest, even if another source kept the conversion alive or its PDF is ready.

Admission bounds queued metadata, outstanding readers, active source-byte reservations, and conversions before invoking a source read. Unknown source sizes reserve `maxInputBytes`; known sizes reserve their stat size. Reads receive that capacity and may read one overflow sentinel byte. `maxSourceBytes` must cover `maxInputBytes`. The final reader allowance is reserved for foreground work. Setting `maxBackgroundConversions` to zero rejects background joins to queued and running work; completed alias hits remain available. Background jobs wait while any foreground job is queued, including when it awaits source capacity. Foreground joins promote queued prewarming; when its last foreground reader leaves, the queued job returns to background priority and eligible work can start immediately. Foreground admission can evict queued speculation. Background concurrency leaves a foreground slot when total concurrency exceeds one. A running prewarm keeps its background admission slot until settlement, even after promotion. The final reader cancels shared work. Removing a queued foreground blocker immediately admits other eligible work; active reservations remain held until actual read/conversion cleanup settles.

The defaults retain 8 PDFs/128 MiB and 64 source aliases, admit 32 readers and 8 queued jobs, reserve at most 100 MiB of source bytes, and allow one background conversion. These limits bound owned requests and binary payloads, not engine RSS, multipart framing, caller-retained results, or PDF.js page rendering.

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

Invalid engine metadata, missing required assets, and conversion errors reject the request instead of switching engines. The shared WASM engine uses LibreOffice's CPU image filter. Native conversion uses its separate platform engine.

Each concurrent slot lazily creates and reuses one kit converter. The provider writes authorized input into a private temporary directory, reads a bounded regular PDF, and removes the directory before settling. Canceling an admitted reader does not block later queued work. Reader cancellation releases only that reader; the final reader and provider disposal cancel shared work. Disposal reports `unavailable` to outstanding readers and joins conversions and converter teardown.

Remote file reads recheck content authorization and source version before consulting the conversion cache. Deferred reads run after conversion admission and verify the source version after reading. Source-read failures pass through; conversion failures return `document-render/failed` with a classified reason and no engine diagnostics. Unload cancels and joins authorization reads, Remote requests, and conversion work.

</details>

-----

<a id="further-exploration"></a>
## Further Exploration

- [Office to PDF](../../../docs/subsystems/office-to-pdf.md) — composition and input/result ownership.
- [Workspace Files](../../api/workspace-files/README.md) — Session file authorization and bounded reads.

-----

<a id="model-experience"></a>
## Model Experience

### Document tool schemas

#### What the model sees

The optional entry declares the schemas in the [tool catalog](../../../docs/tool-catalog.md#deepseek-aidsh-office-to-pdftools). Conversion reports artifact metadata; rendering reports selected image paths or an explicit skipped result. The byte conversion provider contributes no model context.

#### Token effect

Two schemas are present only in scopes mounting the tool entry. Results retain bounded metadata rather than source text or binary output.

#### KV Cache effect

Tool schemas are stable for the mounted preset; changing tool composition replaces that schema context. Operation results append through ordinary tool results.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- Conversion fidelity and installed native/WASM assets belong to `@deepseek-ai/libreoffice-kit`; this provider neither searches for system LibreOffice nor downloads an engine at runtime.
- Queue waiting time is not bounded by `timeoutMs`, which starts only when kit conversion begins.
- Tool authorization and kit controls do not provide an operating-system sandbox against native-engine exploits or concurrent directory replacement by another process. The kit disables macros, document updates and LOK network host access; these tools accept no arbitrary commands.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
