/** Tool lifetimes, resource limits and refusal results around the external engine. */
import { mkdtemp, rm } from 'node:fs/promises'
import { access } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Context } from '@deepseek-ai/cordis'
import { ConversionError, type Converter, type ConverterOptions } from '@deepseek-ai/libreoffice-kit'
import { HarnessError, ToolCallId } from '@deepseek-ai/dsh-llm'
import ToolRuntime from '@deepseek-ai/dsh-tools'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import * as DocumentTools from '../src/tools.ts'
import type { DocumentInput } from '../src/document-files.ts'

const engine = vi.hoisted(() => ({ create: vi.fn<(options?: ConverterOptions) => Promise<Converter>>() }))
const files = vi.hoisted(() => ({ read: vi.fn(), output: vi.fn(), publish: vi.fn(), readOutput: vi.fn() }))
const author = vi.hoisted(() => ({ create: vi.fn() }))
const io = vi.hoisted(() => ({ writeFile: vi.fn() }))
vi.mock('node:fs/promises', async (original) => {
  const actual = await original<typeof import('node:fs/promises')>()
  io.writeFile.mockImplementation(actual.writeFile)
  return { ...actual, writeFile: io.writeFile }
})
vi.mock('@deepseek-ai/libreoffice-kit', async original => ({ ...await original<typeof import('@deepseek-ai/libreoffice-kit')>(), createConverter: engine.create }))
vi.mock('../src/document-files.ts', () => ({ readDocumentInput: files.read, documentOutputPath: files.output, publishDocument: files.publish, readDocumentOutput: files.readOutput }))
vi.mock('../src/markdown-docx.ts', () => ({ markdownToDocx: author.create }))

let ctx: Context
let root: string
let converter: Converter
let policy: 'workspace-write' | 'read-only'
let info: { inputModalities?: string[] }
let input: DocumentInput
const agent = { session: { requestHeader: () => undefined }, options: { provider: 'fixture', model: 'fixture' } }
const signal = new AbortController().signal

async function mount(config: Partial<DocumentTools.Config> = {}) {
  return ctx.plugin(DocumentTools, DocumentTools.Config(config))
}
function call(name: string, args: unknown, actor: typeof agent | undefined = agent) {
  return ctx.tools.execute({ callId: ToolCallId('fixture-call'), name, arguments: args, signal,
    ...(actor === undefined ? {} : { agent: actor as never }) })
}
function text(result: { content: { type: string; text?: string }[] }): string {
  return result.content.map(block => block.text ?? '').join('')
}

beforeEach(async () => {
  vi.clearAllMocks()
  const actualIO = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises')
  io.writeFile.mockImplementation(actualIO.writeFile)
  root = await mkdtemp(join(tmpdir(), 'dsh-document-tools-unit-'))
  policy = 'workspace-write'
  info = { inputModalities: ['text', 'image'] }
  ctx = new Context()
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(ToolRuntime)
  // Conversion tests mock authorized reads; the real local filesystem and Loader run in web-agent-presets.e2e.
  ctx.provide('fs', {} as never)
  ctx.provide('workingDirectory', {} as never)
  ctx.provide('sandboxPolicy', { resolve: () => ({ mode: policy }) } as never)
  ctx.provide('llm', { resolveModelInfo: async () => info } as never)
  input = { root, projectPath: root, cwd: root, path: join(root, 'source.docx'), bytes: Buffer.from('word') }
  files.read.mockImplementation(async () => input)
  files.output.mockImplementation(async (_input: DocumentInput, path: string) => path)
  files.publish.mockImplementation(async (_input: DocumentInput, path: string) => path)
  files.readOutput.mockResolvedValue(Buffer.from('%PDF-1.7\n%%EOF\n'))
  author.create.mockResolvedValue(Buffer.from('generated-word'))
  converter = {
    backend: 'native', render: vi.fn(), recalculate: vi.fn(),
    convert: vi.fn(async () => ({ backend: 'native' as const, missingFonts: ['Missing Font'] })),
    renderImages: vi.fn(async request => ({ schemaVersion: 1 as const, backend: 'native' as const,
      rasterEngine: 'pdfium' as const, source: 'saved' as const, inputPath: request.inputPath,
      sourceSha256: '0'.repeat(64), dpi: 144, pageCount: 1, missingFonts: [],
      images: [{ index: 0, path: join(request.outputDir, 'page-1.png'), width: 100, height: 100,
        rectangle: { x: 0, y: 0, width: 100, height: 100 }, byteLength: 16 }],
    })),
    dispose: vi.fn(async () => {}),
  }
  engine.create.mockResolvedValue(converter)
})

afterEach(async () => {
  try { await ctx.fiber.dispose() }
  finally { await rm(root, { recursive: true, force: true }) }
})

it('registers only conversion and rendering, and removes them on unload', async () => {
  const fiber = await mount()
  expect(ctx.tools.schemas().map(schema => schema.name)).toEqual(['convertir_documento', 'render_document'])
  const presentation = ctx.tools.get('convertir_documento')?.presentCall?.({ entrada: 'source.docx' })
  expect(presentation?.card).toBe('generic')
  expect(ctx.tools.get('render_document')?.presentCall?.({ file_path: 'source.docx' })?.card).toBe('generic')
  await fiber.dispose()
  expect(ctx.tools.get('convertir_documento')).toBeUndefined()
})

it('returns confirmed PDF metadata and disposes the engine', async () => {
  await mount()
  const result = await call('convertir_documento', { entrada: 'source.docx' })
  expect(result.isError).toBe(false)
  expect(text(result)).toContain('libreoffice-native')
  expect(text(result)).toContain('Missing Font')
  expect(converter.dispose).toHaveBeenCalledOnce()
})

it('authors Markdown DOCX without loading an engine', async () => {
  input.path = join(root, 'source.md')
  await mount()
  expect((await call('convertir_documento', { entrada: 'source.md', formato: 'docx' })).isError).toBe(false)
  expect(author.create).toHaveBeenCalledOnce()
  expect(engine.create).not.toHaveBeenCalled()
})

it('converts authored Markdown and existing Word through the engine when needed', async () => {
  await mount()
  input.path = join(root, 'source.markdown')
  expect((await call('convertir_documento', { entrada: 'source.markdown', salida: join(root, 'report.pdf') })).isError).toBe(false)
  input.path = join(root, 'source.docx')
  expect((await call('convertir_documento', { entrada: 'source.docx', formato: 'docx' })).isError).toBe(false)
  expect(converter.convert).toHaveBeenCalledTimes(2)
})

it('refuses read-only calls and calls without a session before touching files', async () => {
  await mount()
  policy = 'read-only'
  expect(text(await call('convertir_documento', { entrada: 'source.docx' }))).toContain('read-only')
  policy = 'workspace-write'
  const noAgent = await ctx.tools.execute({ callId: ToolCallId('no-agent'), name: 'convertir_documento', arguments: { entrada: 'source.docx' }, signal })
  expect(text(noAgent)).toContain('Agent session')
  expect(files.read).not.toHaveBeenCalled()
})

it.each(['wrong extension', 'unsupported input'])('rejects %s before engine execution', async (kind) => {
  await mount()
  if (kind === 'unsupported input') input.path = join(root, 'script.exe')
  const result = await call('convertir_documento', { entrada: 'source.docx', salida: join(root, kind === 'wrong extension' ? 'out.docx' : 'out.pdf') })
  expect(result.isError).toBe(true)
  expect(engine.create).not.toHaveBeenCalled()
})

it.each(['source', 'authored input', 'authored output'])('bounds Markdown %s bytes', async (kind) => {
  input.path = join(root, 'source.md')
  await mount(kind === 'source' ? { maxMarkdownBytes: 1 } : kind === 'authored input' ? { maxInputBytes: 5 } : { maxOutputBytes: 5 })
  expect((await call('convertir_documento', { entrada: 'source.md', formato: 'docx' })).isError).toBe(true)
  expect(files.publish).not.toHaveBeenCalled()
})

it('reports an engine error without its private diagnostics', async () => {
  converter.convert = vi.fn(async () => { throw new ConversionError('failed', 'private engine details') })
  await mount()
  const result = await call('convertir_documento', { entrada: 'source.docx' })
  expect(result.isError).toBe(true)
  expect(text(result)).toContain('Document operation failed')
  expect(text(result)).not.toContain('private engine details')
})

it.each([{ pages: [] }, { pages: [0] }, { pages: [1, 2] }])('rejects invalid page selections %j', async ({ pages }) => {
  await mount({ maxPages: 1 })
  const result = await call('render_document', { file_path: 'source.docx', pages })
  expect(result.isError).toBe(true)
  expect(text(result)).toContain('Choose positive page numbers')
  expect(engine.create).not.toHaveBeenCalled()
})

it('skips visual checks when the route or image capability is missing', async () => {
  await mount()
  info = {}
  expect(text(await call('render_document', { file_path: 'source.docx' }))).toContain('skipped')
  const absent = { ...agent, options: {} }
  const result = await ctx.tools.execute({ callId: ToolCallId('no-route'), name: 'render_document', arguments: { file_path: 'source.docx' }, signal, agent: absent as never })
  expect(text(result)).toContain('route is unavailable')
  expect(files.read).not.toHaveBeenCalled()
})

it('publishes image metadata only after writing the complete selected batch', async () => {
  await mount()
  const result = await call('render_document', { file_path: 'source.docx', output_dir: join(root, 'preview'), pages: [1] })
  expect(result.isError).toBe(false)
  expect(text(result)).toContain('page-1.png')
  expect(text(result)).toContain('ready')
  expect(converter.dispose).toHaveBeenCalledOnce()
})

it('renders authored Markdown and refuses non-document inputs', async () => {
  await mount()
  input.path = join(root, 'source.md')
  expect((await call('render_document', { file_path: 'source.md' })).isError).toBe(false)
  input.path = join(root, 'source.exe')
  expect((await call('render_document', { file_path: 'source.exe' })).isError).toBe(true)
})

it('rejects overlapping work and joins cancellation and engine disposal on unload', async () => {
  const started = Promise.withResolvers<undefined>()
  const release = Promise.withResolvers<undefined>()
  let canceled = false
  converter.convert = vi.fn<Converter['convert']>((_request, upstream) => new Promise<Awaited<ReturnType<Converter['convert']>>>((_resolve, reject) => {
    started.resolve(undefined)
    upstream!.addEventListener('abort', () => { canceled = true; reject(upstream!.reason) }, { once: true })
  }))
  converter.dispose = vi.fn(() => release.promise)
  await mount()
  const pending = call('convertir_documento', { entrada: 'source.docx' })
  await started.promise
  expect(text(await call('convertir_documento', { entrada: 'source.docx' }))).toContain('Another document operation')
  const closing = ctx.fiber.dispose()
  await vi.waitFor(() => expect(canceled).toBe(true))
  release.resolve(undefined)
  await closing
  expect((await pending).isError).toBe(true)
  expect(files.publish).not.toHaveBeenCalled()
})

it('propagates source authorization failures without starting an engine', async () => {
  files.read.mockRejectedValue(new HarnessError('outside the project', 'DOCUMENT_OUTSIDE_WORKSPACE'))
  await mount()
  expect((await call('convertir_documento', { entrada: '../outside.docx' })).isError).toBe(true)
  expect(engine.create).not.toHaveBeenCalled()
})

it.each(['source', 'authored input'])('bounds Markdown %s bytes during rendering', async (kind) => {
  input.path = join(root, 'source.md')
  await mount(kind === 'source' ? { maxMarkdownBytes: 1 } : { maxInputBytes: 5 })
  expect((await call('render_document', { file_path: 'source.md' })).isError).toBe(true)
  expect(converter.renderImages).not.toHaveBeenCalled()
})

it('removes a partial image batch when publication is canceled', async () => {
  const controller = new AbortController()
  const original = files.readOutput.getMockImplementation()!
  files.readOutput.mockImplementation(async (...args: unknown[]) => {
    const result = await original(...args)
    controller.abort()
    return result
  })
  await mount()
  const result = await ctx.tools.execute({ callId: ToolCallId('canceled-preview'), name: 'render_document',
    arguments: { file_path: 'source.docx', output_dir: join(root, 'preview') }, signal: controller.signal, agent: agent as never })
  expect(result.isError).toBe(true)
})

it('refuses excessive complete result metadata before publishing', async () => {
  await mount({ maxMetadataBytes: 1 })
  expect((await call('convertir_documento', { entrada: 'source.docx' })).isError).toBe(true)
  expect((await call('render_document', { file_path: 'source.docx' })).isError).toBe(true)
  expect(files.publish).not.toHaveBeenCalled()
})

it('removes its newly created image directory if writing an image fails', async () => {
  const actual = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises')
  const directory = join(root, 'preview')
  io.writeFile.mockImplementation(async (...args: Parameters<typeof actual.writeFile>) => {
    if (args[0] === join(directory, 'page-1.png')) throw Object.assign(new Error('write refused'), { code: 'EACCES' })
    return actual.writeFile(...args)
  })
  await mount()
  expect((await call('render_document', { file_path: 'source.docx', output_dir: directory })).isError).toBe(true)
  await expect(access(directory)).rejects.toMatchObject({ code: 'ENOENT' })
})
