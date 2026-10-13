/** Scoped document conversion and visual inspection without model-supplied commands. */
import { randomUUID } from 'node:crypto'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, extname, join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { createConverter, ConversionError, CONVERSION_FORMATS, IMAGE_FORMATS, type Converter } from '@deepseek-ai/libreoffice-kit'
import { HarnessError } from '@deepseek-ai/dsh-llm'
import { defineTool, type ToolExecution } from '@deepseek-ai/dsh-tools'
import type {} from '@deepseek-ai/dsh-working-directory'
import type {} from '@deepseek-ai/dsh-sandbox-policy'
import { documentOutputPath, publishDocument, readDocumentInput, readDocumentOutput } from './document-files.ts'
import { markdownToDocx } from './markdown-docx.ts'

/** Limits for one preset's document operations. */
export interface Config {
  /** Maximum simultaneous operations; additional calls reject as busy. */
  maxConcurrentOperations: number
  /** Deadline covering file reads, engine work and publication. */
  timeoutMs: number
  /** Maximum complete source bytes. */
  maxInputBytes: number
  /** Maximum complete document or aggregate PNG bytes. */
  maxOutputBytes: number
  /** Maximum complete UTF-8 JSON result metadata. */
  maxMetadataBytes: number
  /** Maximum selected pages or worksheet tiles. */
  maxPages: number
  /** Raster resolution. */
  dpi: number
  /** Maximum pixels per image. */
  maxPixels: number
  /** Maximum image width or height. */
  maxDimension: number
  /** Maximum Markdown AST nodes. */
  maxMarkdownNodes: number
  /** Maximum nested Markdown depth before report authoring. */
  maxMarkdownDepth: number
  /** Maximum Markdown source bytes before parsing. */
  maxMarkdownBytes: number
  /** Maximum columns in a Markdown report table. */
  maxTableColumns: number
  /** Report font family. */
  reportFont: string
}

/** Deployment defaults validated before registering tools. */
export const Config: z<Partial<Config>, Config> = z.object({
  maxConcurrentOperations: z.natural().min(1).default(1),
  timeoutMs: z.natural().min(1).max(2_147_483_647).default(60_000),
  maxInputBytes: z.natural().min(1).max(Number.MAX_SAFE_INTEGER - 1).default(50 * 1024 * 1024),
  maxOutputBytes: z.natural().min(1).max(Number.MAX_SAFE_INTEGER).default(100 * 1024 * 1024),
  maxMetadataBytes: z.natural().min(1).default(65536),
  maxPages: z.natural().min(1).default(32),
  dpi: z.natural().min(24).max(600).default(144),
  maxPixels: z.natural().min(1).max(16_777_216).default(4_194_304),
  maxDimension: z.natural().min(1).default(4096),
  maxMarkdownNodes: z.natural().min(1).default(40_000),
  maxMarkdownDepth: z.natural().min(1).default(128),
  maxMarkdownBytes: z.natural().min(1).default(1024 * 1024),
  maxTableColumns: z.natural().min(1).default(20),
  reportFont: z.string().pattern(/\S/u).default('Arial'),
})

/** Cordis plugin identity for the model-facing consumer. */
export const name = 'tool-document'
/** Services used to authorize local Session files and register scoped tools. */
export const inject = ['tools', 'fs', 'workingDirectory', 'sandboxPolicy', 'llm']

interface ConversionArgs { entrada: string; formato?: 'pdf' | 'docx'; salida?: string }
interface RenderArgs { file_path: string; output_dir?: string; pages?: number[] }

/**
 * Register document tools in the mounting preset, with cancellation and joined disposal.
 * @param ctx - Preset context carrying the local filesystem and model route.
 * @param config - Validated deployment limits.
 */
export function apply(ctx: Context, config: Config): void {
  const lifetime = new AbortController()
  const active = new Set<Promise<unknown>>()
  function metadata<T extends object>(value: T): T {
    if (Buffer.byteLength(JSON.stringify(value), 'utf8') > config.maxMetadataBytes) {
      throw new HarnessError('Document result exceeds maxMetadataBytes; reduce selected pages or excessive font declarations.', 'DOCUMENT_RESULT_LIMIT')
    }
    return value
  }
  ctx.effect(() => async () => {
    lifetime.abort(new HarnessError('Document tools were unloaded.', 'DOCUMENT_UNAVAILABLE'))
    await Promise.allSettled(active)
  })

  async function run<T>(exec: ToolExecution,
    action: (signal: AbortSignal, scratch: string, obtain: () => Promise<Converter>) => Promise<T>): Promise<T> {
    lifetime.signal.throwIfAborted()
    if (exec.agent === undefined) throw new HarnessError('Document tools require an Agent session.', 'DOCUMENT_SESSION_REQUIRED')
    if (ctx.sandboxPolicy.resolve({ session: exec.agent.session }).mode === 'read-only') {
      throw new HarnessError('The session is read-only. Choose workspace-write in session permissions before generating documents.', 'DOCUMENT_READ_ONLY')
    }
    if (active.size >= config.maxConcurrentOperations) throw new HarnessError('Another document operation is active; retry after it finishes.', 'DOCUMENT_BUSY')
    const signal = AbortSignal.any([exec.signal, lifetime.signal, AbortSignal.timeout(config.timeoutMs)])
    const operation = (async () => {
      signal.throwIfAborted()
      const scratch = await mkdtemp(join(tmpdir(), 'dsh-document-tool-'))
      let converter: Promise<Converter> | undefined
      const obtain = (): Promise<Converter> => converter ??= createConverter({ timeoutMs: config.timeoutMs,
        maxInputBytes: config.maxInputBytes, maxOutputBytes: config.maxOutputBytes })
      try {
        return await action(signal, scratch, obtain)
      } finally {
        try { await (await converter)?.dispose() }
        finally { await rm(scratch, { recursive: true, force: true }) }
      }
    })()
    active.add(operation)
    try { return await operation }
    catch (error) {
      if (error instanceof ConversionError) {
        throw new HarnessError(`Document operation failed (${error.code}). The source was not modified; inspect the input and retry with a new output name.`, 'DOCUMENT_ENGINE_FAILED')
      }
      throw error
    } finally { active.delete(operation) }
  }

  ctx.effect(() => ctx.tools.register(defineTool({
    name: 'convertir_documento',
    description: 'Convert a project Markdown or Office document to a new PDF, or Markdown/Word to DOCX. Uses the bundled engine; never executes scripts or installs software. Input and output must be inside the original project. Existing output files are refused.',
    parameters: {
      entrada: { type: 'string', required: true, description: 'Existing project document path, relative to the current directory or absolute.' },
      formato: { type: 'string', enum: ['pdf', 'docx'], description: 'Output format; defaults to pdf.' },
      salida: { type: 'string', description: 'New output file path with the selected extension; parent directory must exist. Defaults to the input basename with the selected extension.' },
    },
    output: {
      schema: { type: 'object', additionalProperties: false, properties: {
        ruta: { type: 'string', required: true }, bytes: { type: 'integer', required: true },
        formato: { type: 'string', required: true, enum: ['pdf', 'docx'] },
        motor: { type: 'string', required: true }, missingFonts: { type: 'array', required: true, items: { type: 'string' } },
      } },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
    },
    presentCall: (args: ConversionArgs) => ({ card: 'generic', kind: 'execute', title: 'convertir_documento', locations: [{ path: args.entrada }], rawInput: args }),
    async execute(args: ConversionArgs, exec) {
      const format = args.formato ?? 'pdf'
      return run(exec, async (signal, scratch, obtain) => {
        const input = await readDocumentInput(ctx, { ...exec, signal }, args.entrada, config.maxInputBytes)
        let extension = extname(input.path).slice(1).toLowerCase()
        const defaultOutput = join(dirname(input.path), `${basename(input.path, extname(input.path))}.${format}`)
        const output = await documentOutputPath(input, args.salida ?? defaultOutput)
        if (extname(output).toLowerCase() !== `.${format}`) throw new HarnessError('The output extension must match formato.', 'DOCUMENT_UNSUPPORTED_FORMAT')
        let bytes = input.bytes
        const authoredMarkdown = extension === 'md' || extension === 'markdown'
        if (authoredMarkdown) {
          if (bytes.byteLength > config.maxMarkdownBytes) throw new HarnessError('Markdown exceeds maxMarkdownBytes.', 'DOCUMENT_TOO_LARGE')
          bytes = await markdownToDocx(new TextDecoder('utf-8', { fatal: true }).decode(bytes), { font: config.reportFont, maxNodes: config.maxMarkdownNodes, maxTableColumns: config.maxTableColumns, maxDepth: config.maxMarkdownDepth })
          extension = 'docx'
          if (bytes.byteLength > config.maxInputBytes) throw new HarnessError('The generated Word document exceeds maxInputBytes.', 'DOCUMENT_TOO_LARGE')
        }
        if (authoredMarkdown && format === 'docx') {
          if (bytes.byteLength > config.maxOutputBytes) throw new HarnessError('The output exceeds maxOutputBytes.', 'DOCUMENT_TOO_LARGE')
          const value = metadata({ ruta: output, bytes: bytes.byteLength, formato: format, motor: 'docx', missingFonts: [] })
          return { ...value, ruta: await publishDocument(input, output, bytes, signal) }
        }
        if (!CONVERSION_FORMATS.some(group => (group.inputs as readonly string[]).includes(extension)
          && (group.outputs as readonly string[]).includes(format))) {
          throw new HarnessError('Unsupported conversion; use Markdown/Word for DOCX, or Word/Excel/PowerPoint for PDF.', 'DOCUMENT_UNSUPPORTED_FORMAT')
        }
        const source = join(scratch, `input.${extension}`)
        const destination = join(scratch, `output.${format}`)
        await writeFile(source, bytes, { flag: 'wx', mode: 0o600, signal })
        const result = await (await obtain()).convert({ inputPath: source, outputPath: destination }, signal)
        const artifact = await readDocumentOutput(destination, config.maxOutputBytes, signal)
        const value = metadata({ ruta: output, bytes: artifact.byteLength, formato: format,
          motor: `libreoffice-${result.backend}`, missingFonts: result.missingFonts })
        return { ...value, ruta: await publishDocument(input, output, artifact, signal) }
      })
    },
  })))

  ctx.effect(() => ctx.tools.register(defineTool({
    name: 'render_document',
    description: 'Render a project PDF, Office or Markdown document to PNG pages for visual inspection with read_image. Returns skipped without generating images when the current model cannot read images. Does not prove layout was inspected. Output directory must be new and inside the project.',
    parameters: {
      file_path: { type: 'string', required: true, description: 'Existing project document path.' },
      output_dir: { type: 'string', description: 'New project directory for PNG pages; parent must exist. Defaults to a unique directory beside the source.' },
      pages: { type: 'array', items: { type: 'integer' }, description: 'Positive one-based pages/slides to inspect; omit for all. Do not supply for spreadsheets.' },
    },
    output: {
      schema: { type: 'object', additionalProperties: false, properties: {
        status: { type: 'string', required: true, enum: ['ready', 'skipped'] },
        reason: { type: 'string' }, pageCount: { type: 'integer' }, motor: { type: 'string' },
        images: { type: 'array', required: true, items: { type: 'object', additionalProperties: false, properties: {
          path: { type: 'string', required: true }, bytes: { type: 'integer', required: true },
          width: { type: 'integer', required: true }, height: { type: 'integer', required: true },
        } } },
        missingFonts: { type: 'array', items: { type: 'string' } },
      } },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
    },
    presentCall: (args: RenderArgs) => ({ card: 'generic', kind: 'execute', title: 'render_document', locations: [{ path: args.file_path }], rawInput: args }),
    async execute(args: RenderArgs, exec) {
      return run(exec, async (signal, scratch, obtain) => {
        if (args.pages !== undefined
        && (args.pages.length === 0 || args.pages.length > config.maxPages || args.pages.some(page => page < 1))) {
          throw new HarnessError('Choose positive page numbers within maxPages; omit pages to render the whole document.', 'DOCUMENT_INVALID_PAGES')
        }
        const routed = exec.agent?.session.requestHeader()?.config
        const provider = routed?.provider ?? exec.agent?.options.provider
        const modelName = routed?.model ?? exec.agent?.options.model
        if (provider === undefined || modelName === undefined) {
          return metadata({ status: 'skipped' as const, reason: 'The current model route is unavailable; visual inspection was not performed.', images: [] })
        }
        const model = await ctx.llm.resolveModelInfo(provider, modelName, signal)
        if (!model.inputModalities?.includes('image')) {
          return metadata({ status: 'skipped' as const, reason: 'The current model does not accept images; use an image-capable model for visual inspection.', images: [] })
        }
        const input = await readDocumentInput(ctx, { ...exec, signal }, args.file_path, config.maxInputBytes)
        let extension = extname(input.path).slice(1).toLowerCase()
        let bytes = input.bytes
        if (extension === 'md' || extension === 'markdown') {
          if (bytes.byteLength > config.maxMarkdownBytes) throw new HarnessError('Markdown exceeds maxMarkdownBytes.', 'DOCUMENT_TOO_LARGE')
          bytes = await markdownToDocx(new TextDecoder('utf-8', { fatal: true }).decode(bytes), { font: config.reportFont, maxNodes: config.maxMarkdownNodes, maxTableColumns: config.maxTableColumns, maxDepth: config.maxMarkdownDepth })
          extension = 'docx'
          if (bytes.byteLength > config.maxInputBytes) throw new HarnessError('The generated Word document exceeds maxInputBytes.', 'DOCUMENT_TOO_LARGE')
        }
        if (!(IMAGE_FORMATS as readonly string[]).includes(extension)) throw new HarnessError('Use PDF, Office or Markdown for rendering.', 'DOCUMENT_UNSUPPORTED_FORMAT')
        const output = await documentOutputPath(input, args.output_dir ?? join(dirname(input.path), `preview-${randomUUID()}`))
        const source = join(scratch, `input.${extension}`)
        const pages = join(scratch, 'pages')
        await writeFile(source, bytes, { flag: 'wx', mode: 0o600, signal })
        const result = await (await obtain()).renderImages({ inputPath: source, outputDir: pages,
          ...(args.pages === undefined ? {} : { pages: args.pages }),
          dpi: config.dpi, maxPages: config.maxPages, maxPixels: config.maxPixels, maxDimension: config.maxDimension,
        }, signal)
        const artifacts: { name: string; bytes: Uint8Array; width: number; height: number }[] = []
        let remaining = config.maxOutputBytes
        for (const image of result.images) {
          const data = await readDocumentOutput(image.path, remaining, signal)
          remaining -= data.byteLength
          artifacts.push({ name: basename(image.path), bytes: data, width: image.width, height: image.height })
        }
        signal.throwIfAborted()
        const value = metadata({ status: 'ready' as const, pageCount: result.pageCount,
          motor: result.rasterEngine, missingFonts: result.missingFonts,
          images: artifacts.map(image => ({ path: join(output, image.name), bytes: image.bytes.byteLength,
            width: image.width, height: image.height })),
        })
        await mkdir(output, { mode: 0o700 })
        try {
          for (const image of artifacts) await writeFile(join(output, image.name), image.bytes, { flag: 'wx', mode: 0o600, signal })
          signal.throwIfAborted()
        } catch (error) {
          await rm(output, { recursive: true, force: true })
          throw error
        }
        return value
      })
    },
  })))
}
