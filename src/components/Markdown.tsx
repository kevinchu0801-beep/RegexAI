import type { ReactNode } from 'react'

// 极简 Markdown 渲染：支持标题、无序列表、**加粗**、`行内代码`。
// 仅用于展示 AI 解释，避免引入额外依赖，且不使用 innerHTML 注入。

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  // 依次拆分 **bold** 与 `code`
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const token = m[0]
    if (token.startsWith('**')) {
      nodes.push(
        <strong key={`${keyPrefix}-b${i}`} className="font-semibold text-slate-100">
          {token.slice(2, -2)}
        </strong>,
      )
    } else {
      nodes.push(
        <code
          key={`${keyPrefix}-c${i}`}
          className="rounded bg-slate-800 px-1 py-0.5 font-mono text-[0.85em] text-emerald-300"
        >
          {token.slice(1, -1)}
        </code>,
      )
    }
    last = m.index + token.length
    i++
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export function Markdown({ text }: { text: string }) {
  const lines = text.split('\n')
  const blocks: ReactNode[] = []
  let list: ReactNode[] = []

  const flushList = () => {
    if (list.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="ml-4 list-disc space-y-1">
          {list}
        </ul>,
      )
      list = []
    }
  }

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd()
    if (/^\s*[-*]\s+/.test(line)) {
      list.push(
        <li key={`li-${idx}`} className="text-slate-300">
          {renderInline(line.replace(/^\s*[-*]\s+/, ''), `li-${idx}`)}
        </li>,
      )
      return
    }
    flushList()
    if (!line.trim()) return
    if (/^#{1,6}\s/.test(line)) {
      blocks.push(
        <h4 key={`h-${idx}`} className="mt-2 font-semibold text-slate-100">
          {renderInline(line.replace(/^#{1,6}\s/, ''), `h-${idx}`)}
        </h4>,
      )
    } else {
      blocks.push(
        <p key={`p-${idx}`} className="text-slate-300">
          {renderInline(line, `p-${idx}`)}
        </p>,
      )
    }
  })
  flushList()

  return <div className="space-y-2 text-sm leading-relaxed">{blocks}</div>
}
