/** Markdown report authoring without executable scripts or external resources. */
import { Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { gfm } from 'micromark-extension-gfm'
import type { Nodes, PhrasingContent, RootContent } from 'mdast'
import { HarnessError } from '@deepseek-ai/dsh-llm'

/** Report typography and parser limits supplied by the deployment. */
export interface MarkdownDocumentOptions {
  /** Font family used for report text. */
  font: string
  /** Maximum Markdown nodes, including nested inline content. */
  maxNodes: number
  /** Maximum columns in a report table. */
  maxTableColumns: number
  /** Maximum nested block or inline depth. */
  maxDepth: number
}

function runs(nodes: readonly PhrasingContent[], style: { bold?: boolean; italics?: boolean; strike?: boolean } = {}): TextRun[] {
  return nodes.flatMap((node) => {
    switch (node.type) {
      case 'text': return [new TextRun({ text: node.value, ...style })]
      case 'strong': return runs(node.children, { ...style, bold: true })
      case 'emphasis': return runs(node.children, { ...style, italics: true })
      case 'delete': return runs(node.children, { ...style, strike: true })
      case 'inlineCode': return [new TextRun({ text: node.value, font: 'Consolas', ...style })]
      case 'break': return [new TextRun({ break: 1 })]
      case 'link': return [...runs(node.children, style), new TextRun({ text: ` (${node.url})`, ...style })]
      case 'html':
        if (/^<br\s*\/?\s*>$/iu.test(node.value.trim())) return [new TextRun({ break: 1 })]
        if (/^<!--[\s\S]*-->$/u.test(node.value.trim())) return []
        throw new Error('Raw HTML is not supported; use Markdown text and tables.')
      default: throw new Error(`Markdown ${node.type} is not supported; replace it with explicit text before converting.`)
    }
  })
}

function blocks(nodes: readonly RootContent[], maxTableColumns: number): (Paragraph | Table)[] {
  return nodes.flatMap((node): (Paragraph | Table)[] => {
    switch (node.type) {
      case 'heading': {
        const levels = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3,
          4: HeadingLevel.HEADING_4, 5: HeadingLevel.HEADING_5, 6: HeadingLevel.HEADING_6 }
        return [new Paragraph({ children: runs(node.children), heading: levels[node.depth], keepNext: true })]
      }
      case 'paragraph': return [new Paragraph({ children: runs(node.children), spacing: { after: 120 } })]
      case 'code': return node.value.split('\n').map(text => new Paragraph({ children: [new TextRun({ text, font: 'Consolas', size: 18 })] }))
      case 'blockquote': return blocks(node.children, maxTableColumns)
      case 'list': return node.children.flatMap((item, index) => {
        const marker = node.ordered ? `${Number(node.start) + index}. ` : '• '
        const [first, ...rest] = item.children
        if (first?.type !== 'paragraph') throw new Error('List items must start with a text paragraph.')
        return [new Paragraph({ children: [new TextRun(marker), ...runs(first.children)], spacing: { after: 120 } }),
          ...blocks(rest, maxTableColumns)]
      })
      case 'table': {
        const count = node.children.reduce((columns, row) => Math.max(columns, row.children.length), 0)
        if (count > maxTableColumns) throw new HarnessError('A table exceeds maxTableColumns.', 'DOCUMENT_MARKDOWN_LIMIT')
        return [new Table({ width: { size: 100, type: WidthType.PERCENTAGE },
          rows: node.children.map((row, index) => new TableRow({ tableHeader: index === 0, cantSplit: true,
            children: row.children.map(cell => new TableCell({ width: { size: 100 / count, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: runs(cell.children, index === 0 ? { bold: true } : {}) })],
            })),
          })),
        }), new Paragraph('')]
      }
      case 'html':
        if (node.value.trim() === '<!-- salto-pagina -->') return [new Paragraph({ pageBreakBefore: true })]
        if (/^<!--[\s\S]*-->$/u.test(node.value.trim())) return []
        throw new Error('Raw HTML is not supported; use Markdown text and tables.')
      case 'thematicBreak': return [new Paragraph({ text: '—', spacing: { before: 120, after: 120 } })]
      case 'definition': throw new Error('Reference links are not supported; use inline Markdown links.')
      /* v8 ignore next -- the configured core/GFM parser cannot emit other root nodes; future extensions must reject here. */
      default: throw new Error(`Markdown ${node.type} is not supported; replace it with explicit text before converting.`)
    }
  })
}

/**
 * Generate a Word report preserving Markdown headings, tables and inline emphasis.
 * @param markdown - Authorized UTF-8 source; code blocks are inert text.
 * @param options - Deployment typography and node limit.
 * @returns Complete DOCX bytes; unsupported constructs reject instead of dropping content.
 */
export async function markdownToDocx(markdown: string, options: MarkdownDocumentOptions): Promise<Uint8Array> {
  const root = fromMarkdown(markdown, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] })
  let count = 0
  const pending: { node: Nodes; depth: number }[] = [{ node: root, depth: 0 }]
  for (let entry = pending.pop(); entry !== undefined; entry = pending.pop()) {
    const { node, depth } = entry
    if (++count > options.maxNodes) throw new HarnessError('Markdown exceeds maxMarkdownNodes.', 'DOCUMENT_MARKDOWN_LIMIT')
    if (depth > options.maxDepth) throw new HarnessError('Markdown exceeds maxMarkdownDepth.', 'DOCUMENT_MARKDOWN_LIMIT')
    if ('children' in node) for (const child of node.children) pending.push({ node: child, depth: depth + 1 })
  }
  return Packer.toBuffer(new Document({ creator: 'Grupo Karimbatá',
    styles: { default: { document: { run: { font: options.font, size: 22 }, paragraph: { spacing: { after: 120 } } } } },
    sections: [{ properties: { page: { margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
      children: blocks(root.children, options.maxTableColumns) }],
  }))
}
