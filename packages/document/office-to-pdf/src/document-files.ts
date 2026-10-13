/** Local project authorization and exclusive publication of document artifacts. */
import { constants } from 'node:fs'
import { link, lstat, mkdtemp, open, realpath, rm, writeFile } from 'node:fs/promises'
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Context } from '@deepseek-ai/cordis'
import type { ToolExecution } from '@deepseek-ai/dsh-tools'
import type {} from '@deepseek-ai/dsh-fs'
import type {} from '@deepseek-ai/dsh-working-directory'
import type {} from '@deepseek-ai/dsh-sandbox-policy'
import { HarnessError } from '@deepseek-ai/dsh-llm'

/** One local file snapshot and the Session's fixed project root. */
export interface DocumentInput {
  /** Canonical local project root. */
  root: string
  /** Original project directory, before resolving local aliases. */
  projectPath: string
  /** Canonical input path. */
  path: string
  /** Current directory used for relative output names. */
  cwd: string
  /** Bounded bytes read through the mounted filesystem. */
  bytes: Uint8Array
}

function inside(root: string, path: string): boolean {
  const part = relative(root, path)
  return part !== '..' && !part.startsWith(`..${sep}`) && !isAbsolute(part)
}

/**
 * Read one regular local file inside the Session's original project root.
 * @param ctx - Mounted filesystem, working directory and policy services.
 * @param exec - Calling Agent and cancellation.
 * @param input - Absolute or current-directory-relative source path.
 * @param limit - Inclusive byte cap.
 * @returns Snapshot independent of later source edits; links outside the project reject.
 */
export async function readDocumentInput(ctx: Context, exec: ToolExecution, input: string, limit: number): Promise<DocumentInput> {
  if (exec.agent === undefined) throw new HarnessError('Document tools require an Agent session.', 'DOCUMENT_SESSION_REQUIRED')
  const rootName = exec.agent.session.header.cwd ?? ctx.sandboxPolicy.workspaceRoot
  if (ctx.fs.processPathFromHostPath(rootName) === undefined || /^\\\\/u.test(rootName)) {
    throw new HarnessError('Document conversion requires a local project.', 'DOCUMENT_LOCAL_REQUIRED')
  }
  const rootTarget = await ctx.fs.resolve(rootName, { signal: exec.signal })
  const url = new URL(ctx.fs.fileUrl(rootTarget))
  if (url.protocol !== 'file:' || (url.hostname !== '' && url.hostname !== 'localhost')) {
    throw new HarnessError('Document conversion requires a local project.', 'DOCUMENT_LOCAL_REQUIRED')
  }
  const root = await realpath(fileURLToPath(url))
  const cwd = await ctx.workingDirectory.ensure(exec.agent, exec.signal)
  const candidate = resolve(cwd, input)
  if (!inside(resolve(rootName), candidate) && !inside(root, candidate)) {
    throw new HarnessError('The document must be inside the project.', 'DOCUMENT_OUTSIDE_WORKSPACE')
  }
  const target = await ctx.fs.resolve(input, { cwd, signal: exec.signal })
  if (!ctx.fs.contains(rootTarget, target)) throw new HarnessError('The document must be inside the project.', 'DOCUMENT_OUTSIDE_WORKSPACE')
  const path = await realpath(fileURLToPath(ctx.fs.fileUrl(target)))
  if (!inside(root, path)) throw new HarnessError('The document must be inside the project.', 'DOCUMENT_OUTSIDE_WORKSPACE')
  const before = await ctx.fs.stat(target, exec.signal)
  if (before?.type !== 'file') throw new HarnessError('The input must be an existing regular file.', 'DOCUMENT_INVALID_INPUT')
  if (before.size !== undefined && before.size > limit) throw new HarnessError('The document exceeds maxInputBytes.', 'DOCUMENT_TOO_LARGE')
  const bytes = await ctx.fs.readByteRange(target, { offset: 0, length: limit + 1 }, exec.signal)
  if (bytes.byteLength > limit) throw new HarnessError('The document exceeds maxInputBytes.', 'DOCUMENT_TOO_LARGE')
  const after = await ctx.fs.stat(target, exec.signal)
  if (after?.version !== before.version) throw new HarnessError('The source changed while being read; retry the current version.', 'DOCUMENT_SOURCE_CHANGED')
  return { root, projectPath: resolve(rootName), path, cwd, bytes }
}

/**
 * Resolve a fresh output name under an existing, canonical project directory.
 * @param input - Authorized project snapshot.
 * @param output - Absolute or current-directory-relative name.
 * @returns Canonical output path; an escaped parent rejects before rendering.
 */
export async function documentOutputPath(input: DocumentInput, output: string): Promise<string> {
  const path = resolve(input.cwd, output)
  if (!inside(input.root, path) && !inside(input.projectPath, path)) {
    throw new HarnessError('The output must be inside the project.', 'DOCUMENT_OUTSIDE_WORKSPACE')
  }
  const parent = await realpath(dirname(path))
  if (!inside(input.root, parent)) throw new HarnessError('The output must be inside the project.', 'DOCUMENT_OUTSIDE_WORKSPACE')
  const final = join(parent, basename(path))
  try { await lstat(final) }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return final
    throw error
  }
  throw new HarnessError('The output already exists; choose a new name.', 'DOCUMENT_OUTPUT_EXISTS')
}

/**
 * Publish one complete document without overwriting an existing file or link.
 * @param input - Authorized project snapshot.
 * @param output - Canonical requested file path.
 * @param bytes - Complete generated document.
 * @param signal - Cancellation checked before publication.
 * @returns Final path after publication and scratch cleanup.
 */
export async function publishDocument(input: DocumentInput, output: string, bytes: Uint8Array, signal: AbortSignal): Promise<string> {
  const final = await documentOutputPath(input, output)
  const scratch = await mkdtemp(join(dirname(final), '.dsh-document-'))
  try {
    const temporary = join(scratch, 'artifact')
    await writeFile(temporary, bytes, { flag: 'wx', mode: 0o600, signal })
    signal.throwIfAborted()
    try { await link(temporary, final) }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EEXIST') throw new HarnessError('The output already exists; choose a new name.', 'DOCUMENT_OUTPUT_EXISTS')
      throw error
    }
    return final
  } finally { await rm(scratch, { recursive: true, force: true }) }
}

/**
 * Read an engine-owned output with a byte cap.
 * @param path - Private engine output path.
 * @param limit - Inclusive remaining output-byte allowance.
 * @param signal - Calling operation's cancellation.
 * @returns Complete output bytes.
 */
export async function readDocumentOutput(path: string, limit: number, signal: AbortSignal): Promise<Uint8Array> {
  signal.throwIfAborted()
  const entry = await lstat(path)
  if (!entry.isFile()) throw new HarnessError('Generated output is not a regular file.', 'DOCUMENT_INVALID_OUTPUT')
  const file = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW)
  try {
    const info = await file.stat()
    if (info.size > limit) throw new HarnessError('Generated output exceeds maxOutputBytes.', 'DOCUMENT_TOO_LARGE')
    const bytes = Buffer.alloc(info.size + 1)
    let length = 0
    while (length < bytes.length) {
      signal.throwIfAborted()
      const read = await file.read(bytes, length, bytes.length - length, null)
      if (read.bytesRead === 0) break
      length += read.bytesRead
    }
    if (length !== info.size) throw new HarnessError('Generated output changed while being read.', 'DOCUMENT_OUTPUT_CHANGED')
    return bytes.subarray(0, length)
  } finally { await file.close() }
}
