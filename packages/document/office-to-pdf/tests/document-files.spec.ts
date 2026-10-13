/** Publication refuses escaped paths and keeps existing documents intact. */
import { lstat, mkdir, mkdtemp, readFile, realpath, rm, symlink, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, it, onTestFinished } from 'vitest'
import { vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { renameSync, symlinkSync } from 'node:fs'
import LocalFileSystem from '@deepseek-ai/dsh-fs-local'
import { documentOutputPath, publishDocument, readDocumentInput, readDocumentOutput, type DocumentInput } from '../src/document-files.ts'

const io = vi.hoisted(() => ({ link: vi.fn(), lstat: vi.fn(), open: vi.fn() }))
vi.mock('node:fs/promises', async (original) => {
  const actual = await original<typeof import('node:fs/promises')>()
  io.link.mockImplementation(actual.link)
  io.lstat.mockImplementation(actual.lstat)
  io.open.mockImplementation(actual.open)
  return { ...actual, link: io.link, lstat: io.lstat, open: io.open }
})

async function project(): Promise<{ parent: string; input: DocumentInput }> {
  const parent = await mkdtemp(join(tmpdir(), 'dsh-document-publication-'))
  const root = join(parent, 'project')
  const shortcut = join(root, 'shortcut')
  onTestFinished(async () => {
    try {
      const entry = await lstat(shortcut).catch((error: NodeJS.ErrnoException) => {
        if (error.code === 'ENOENT') return undefined
        throw error
      })
      if (entry?.isSymbolicLink()) await unlink(shortcut)
    } finally { await rm(parent, { recursive: true, force: true }) }
  })
  await mkdir(root)
  const canonical = await realpath(root)
  return { parent, input: { root: canonical, projectPath: root, cwd: root, path: join(root, 'input.md'), bytes: new Uint8Array() } }
}

async function reader() {
  const fixture = await project()
  const ctx = new Context()
  onTestFinished(() => ctx.fiber.dispose())
  await ctx.plugin(LocalFileSystem, { cwd: fixture.input.cwd })
  ctx.provide('workingDirectory', { ensure: async () => fixture.input.cwd } as never)
  ctx.provide('sandboxPolicy', { workspaceRoot: fixture.input.cwd } as never)
  const exec = { agent: { session: { header: { cwd: fixture.input.cwd } } }, signal: new AbortController().signal } as never
  await writeFile(fixture.input.path, 'ámbito')
  return { ...fixture, ctx, exec }
}

it('reads a version-stable snapshot through the local filesystem', async () => {
  const { ctx, exec, input } = await reader()
  expect(Buffer.from((await readDocumentInput(ctx, exec, 'input.md', 100)).bytes).toString()).toBe('ámbito')
  expect((await readDocumentInput(ctx, exec, input.path, 100)).root).toBe(input.root)
})

it('refuses outside inputs before reading contents and follows no escaped directory link', async () => {
  const { ctx, exec, input, parent } = await reader()
  const outside = join(parent, 'outside')
  await mkdir(outside)
  await writeFile(join(outside, 'secret.md'), 'outside')
  await symlink(outside, join(input.cwd, 'shortcut'), process.platform === 'win32' ? 'junction' : 'dir')
  await expect(readDocumentInput(ctx, exec, '../outside/secret.md', 100)).rejects.toMatchObject({ code: 'DOCUMENT_OUTSIDE_WORKSPACE' })
  await expect(readDocumentInput(ctx, exec, 'shortcut/secret.md', 100)).rejects.toMatchObject({ code: 'DOCUMENT_OUTSIDE_WORKSPACE' })
})

it('rejects directory inputs and oversized snapshots', async () => {
  const { ctx, exec, input } = await reader()
  await expect(readDocumentInput(ctx, exec, input.cwd, 100)).rejects.toMatchObject({ code: 'DOCUMENT_INVALID_INPUT' })
  await expect(readDocumentInput(ctx, exec, 'input.md', 1)).rejects.toMatchObject({ code: 'DOCUMENT_TOO_LARGE' })
})

it('detects changes between metadata lookup and complete source read', async () => {
  const { ctx, exec, input } = await reader()
  const actual = ctx.fs.readByteRange.bind(ctx.fs)
  vi.spyOn(ctx.fs, 'readByteRange').mockImplementation(async (...args) => {
    const bytes = await actual(...args)
    await writeFile(input.path, 'changed source with a different length')
    return bytes
  })
  await expect(readDocumentInput(ctx, exec, 'input.md', 100)).rejects.toMatchObject({ code: 'DOCUMENT_SOURCE_CHANGED' })
})

it('refuses calls without a session and filesystems without local process paths', async () => {
  const { ctx, exec } = await reader()
  await expect(readDocumentInput(ctx, { signal: new AbortController().signal } as never, 'input.md', 100)).rejects.toMatchObject({ code: 'DOCUMENT_SESSION_REQUIRED' })
  vi.spyOn(ctx.fs, 'processPathFromHostPath').mockReturnValue(undefined)
  await expect(readDocumentInput(ctx, exec, 'input.md', 100)).rejects.toMatchObject({ code: 'DOCUMENT_LOCAL_REQUIRED' })
})

it('uses the deployment project for a session without cwd', async () => {
  const { ctx } = await reader()
  const exec = { agent: { session: { header: {} } }, signal: new AbortController().signal } as never
  expect(Buffer.from((await readDocumentInput(ctx, exec, 'input.md', 100)).bytes).toString()).toBe('ámbito')
})

it.each(['ssh://server/project', 'file://server/project'])('rejects nonlocal project URIs: %s', async (uri) => {
  const { ctx, exec } = await reader()
  vi.spyOn(ctx.fs, 'fileUrl').mockReturnValue(uri)
  await expect(readDocumentInput(ctx, exec, 'input.md', 100)).rejects.toMatchObject({ code: 'DOCUMENT_LOCAL_REQUIRED' })
})

it('catches a directory being redirected after filesystem resolution', async () => {
  const { ctx, exec, input, parent } = await reader()
  const shortcut = join(input.cwd, 'shortcut')
  const outside = join(parent, 'outside')
  await mkdir(shortcut)
  await mkdir(outside)
  await writeFile(join(shortcut, 'input.md'), 'inside')
  await writeFile(join(outside, 'input.md'), 'outside')
  const contains = ctx.fs.contains.bind(ctx.fs)
  vi.spyOn(ctx.fs, 'contains').mockImplementation((root, target) => {
    const admitted = contains(root, target)
    renameSync(shortcut, join(input.cwd, 'previous'))
    symlinkSync(outside, shortcut, process.platform === 'win32' ? 'junction' : 'dir')
    return admitted
  })
  await expect(readDocumentInput(ctx, exec, 'shortcut/input.md', 100)).rejects.toMatchObject({ code: 'DOCUMENT_OUTSIDE_WORKSPACE' })
})

it('keeps the read cap when source metadata omits its size', async () => {
  const { ctx, exec } = await reader()
  const actual = ctx.fs.stat.bind(ctx.fs)
  vi.spyOn(ctx.fs, 'stat').mockImplementation(async (...args) => {
    const info = await actual(...args)
    if (info === undefined) return undefined
    const { size: _size, ...withoutSize } = info
    return withoutSize
  })
  await expect(readDocumentInput(ctx, exec, 'input.md', 1)).rejects.toMatchObject({ code: 'DOCUMENT_TOO_LARGE' })
})

it('propagates inspection and publication failures without overwriting files', async () => {
  const { input } = await project()
  io.lstat.mockRejectedValueOnce(Object.assign(new Error('permission'), { code: 'EACCES' }))
  await expect(documentOutputPath(input, 'report.pdf')).rejects.toMatchObject({ code: 'EACCES' })
  io.link.mockRejectedValueOnce(Object.assign(new Error('permission'), { code: 'EACCES' }))
  await expect(publishDocument(input, join(input.cwd, 'report.pdf'), Buffer.from('result'), new AbortController().signal)).rejects.toMatchObject({ code: 'EACCES' })
})

it('preserves a competing file created between authorization and publication', async () => {
  const { input } = await project()
  const actual = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises')
  io.link.mockImplementationOnce(async (source: string, output: string) => {
    await writeFile(output, 'competing result', { flag: 'wx' })
    return actual.link(source, output)
  })
  const output = join(input.cwd, 'report.pdf')
  await expect(publishDocument(input, output, Buffer.from('our result'), new AbortController().signal)).rejects.toMatchObject({ code: 'DOCUMENT_OUTPUT_EXISTS' })
  expect(await readFile(output, 'utf8')).toBe('competing result')
})

it('refuses non-file engine output and detects a changed file after stat', async () => {
  const { input } = await project()
  await expect(readDocumentOutput(input.cwd, 100, new AbortController().signal)).rejects.toMatchObject({ code: 'DOCUMENT_INVALID_OUTPUT' })
  const output = join(input.cwd, 'changing')
  await writeFile(output, 'before')
  const actual = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises')
  io.open.mockImplementationOnce(async (...args: Parameters<typeof actual.open>) => {
    const file = await actual.open(...args)
    const original = file.stat.bind(file)
    vi.spyOn(file, 'stat').mockImplementationOnce(async () => {
      const snapshot = await original()
      await writeFile(output, 'changed and larger')
      return snapshot
    })
    return file
  })
  await expect(readDocumentOutput(output, 100, new AbortController().signal)).rejects.toMatchObject({ code: 'DOCUMENT_OUTPUT_CHANGED' })
})

it('publishes complete bytes and refuses to replace an existing result', async () => {
  const { input } = await project()
  const path = await documentOutputPath(input, 'report.pdf')
  await publishDocument(input, path, Buffer.from('complete result'), new AbortController().signal)
  expect(await readFile(path, 'utf8')).toBe('complete result')
  await expect(publishDocument(input, path, Buffer.from('replacement'), new AbortController().signal)).rejects.toMatchObject({ code: 'DOCUMENT_OUTPUT_EXISTS' })
  expect(await readFile(path, 'utf8')).toBe('complete result')
})

it('refuses traversal and directory links outside the original project', async () => {
  const { parent, input } = await project()
  const outside = join(parent, 'outside')
  await mkdir(outside)
  await symlink(outside, join(input.cwd, 'shortcut'), process.platform === 'win32' ? 'junction' : 'dir')
  await expect(documentOutputPath(input, '../escape.pdf')).rejects.toMatchObject({ code: 'DOCUMENT_OUTSIDE_WORKSPACE' })
  await expect(documentOutputPath(input, 'shortcut/escape.pdf')).rejects.toMatchObject({ code: 'DOCUMENT_OUTSIDE_WORKSPACE' })
})

it('does not replace an existing final-file link', async () => {
  const { input } = await project()
  await mkdir(join(input.cwd, 'target'))
  await symlink(join(input.cwd, 'target'), join(input.cwd, 'shortcut'), process.platform === 'win32' ? 'junction' : 'dir')
  await expect(documentOutputPath(input, 'shortcut')).rejects.toMatchObject({ code: 'DOCUMENT_OUTPUT_EXISTS' })
})

it('publishes nothing when canceled before the commit', async () => {
  const { input } = await project()
  const path = join(input.cwd, 'canceled.pdf')
  await expect(publishDocument(input, path, Buffer.from('result'), AbortSignal.abort())).rejects.toBeDefined()
  await expect(readFile(path)).rejects.toMatchObject({ code: 'ENOENT' })
})

it('bounds complete output bytes', async () => {
  const { input } = await project()
  const path = join(input.cwd, 'output')
  await writeFile(path, '12345')
  await expect(readDocumentOutput(path, 4, new AbortController().signal)).rejects.toMatchObject({ code: 'DOCUMENT_TOO_LARGE' })
  expect(await readDocumentOutput(path, 5, new AbortController().signal)).toEqual(Buffer.from('12345'))
})
