/** Report contents survive conversion, while executable and unsupported markup rejects. */
import { unzipSync } from 'fflate'
import { expect, it } from 'vitest'
import { markdownToDocx } from '../src/markdown-docx.ts'

const options = { font: 'Arial', maxNodes: 1000, maxTableColumns: 10, maxDepth: 128 }

it('preserves headings, emphasis, Spanish, tables, lists and page breaks in Word', async () => {
  const bytes = await markdownToDocx('# Alcance\n\n**Karimbatá** y aprobación.\n\n- Conciliar pagos\n\n| ID | Descripción |\n|---|---|\n| RF-001 | Integración |\n\n<!-- salto-pagina -->\n\n## Revisión\n', options)
  const archive = unzipSync(bytes)
  const xml = new TextDecoder().decode(archive['word/document.xml'])
  for (const text of ['Alcance', 'Karimbatá', 'aprobación', 'Conciliar pagos', 'RF-001', 'Integración', 'Revisión']) expect(xml).toContain(text)
  expect(xml).toContain('w:cantSplit')
  expect(xml).toContain('w:tblHeader')
  expect(xml).toContain('w:pageBreakBefore')
})

it('keeps code and link destinations as inert visible text', async () => {
  const bytes = await markdownToDocx('```powershell\nRemove-Item *.docx\n```\n\n[Fuente](https://example.invalid/source)', options)
  const archive = unzipSync(bytes)
  expect(new TextDecoder().decode(archive['word/document.xml'])).toContain('Remove-Item *.docx')
  expect(new TextDecoder().decode(archive['word/document.xml'])).toContain('https://example.invalid/source')
  expect(new TextDecoder().decode(archive['word/_rels/document.xml.rels'])).not.toContain('TargetMode="External"')
})

it.each(['![Logo](https://example.invalid/logo.png)', '<script>alert(1)</script>', '[Fuente][x]\n\n[x]: https://example.invalid'])('refuses unsupported markup without silently discarding it: %s', async (source) => {
  await expect(markdownToDocx(source, options)).rejects.toThrow(/not supported/u)
})

it('bounds AST nodes and table columns', async () => {
  await expect(markdownToDocx('# Uno\n\nDos', { ...options, maxNodes: 2 })).rejects.toThrow('maxMarkdownNodes')
  await expect(markdownToDocx('| A | B |\n|---|---|\n| uno | dos |', { ...options, maxTableColumns: 1 })).rejects.toThrow('maxTableColumns')
  await expect(markdownToDocx('> > > profundidad', { ...options, maxDepth: 2 })).rejects.toThrow('maxMarkdownDepth')
})

it('preserves ordered items, quotations, code styling and inline breaks', async () => {
  const bytes = await markdownToDocx('3. *Primero* con ~~descarte~~ y `código`\n4. Segundo  \n   continuación<br/>final<!-- nota -->\n\n> Cita\n\n---\n\n<!-- comentario -->', options)
  const xml = new TextDecoder().decode(unzipSync(bytes)['word/document.xml'])
  for (const text of ['3. ', '4. ', 'Primero', 'descarte', 'código', 'continuación', 'final', 'Cita']) expect(xml).toContain(text)
  expect(xml).toContain('w:strike')
  expect(xml).toContain('w:br')
})

it.each(['Antes <u>texto</u>', '- # Encabezado', '[def]: https://example.invalid'])('rejects unsupported inline HTML, list layouts and definitions: %s', async (source) => {
  await expect(markdownToDocx(source, options)).rejects.toThrow(/not supported|must start/u)
})
