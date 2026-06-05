import { useRef } from 'react'
import type { Segment } from '../lib/regexEngine'

interface Props {
  text: string
  segments: Segment[]
  hasPattern: boolean
  onChange: (v: string) => void
}

// 通过两组交替的高亮色区分相邻匹配，提升可读性。
const HL = [
  'bg-indigo-500/30 text-indigo-100 rounded',
  'bg-fuchsia-500/30 text-fuchsia-100 rounded',
]

export function TestArea({ text, segments, hasPattern, onChange }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null)

  // 让高亮层与文本框保持完全一致的滚动位置
  function syncScroll(e: React.UIEvent<HTMLTextAreaElement>) {
    const el = backdropRef.current
    if (el) {
      el.scrollTop = e.currentTarget.scrollTop
      el.scrollLeft = e.currentTarget.scrollLeft
    }
  }

  const shared =
    'absolute inset-0 m-0 h-full w-full whitespace-pre-wrap break-words p-4 font-mono text-sm leading-6'

  return (
    <section className="panel flex min-h-[16rem] flex-1 flex-col p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-300">测试文本</h2>
        <span className="text-xs text-slate-500">实时高亮匹配结果</span>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-lg border border-slate-700 bg-slate-950/70">
        <div ref={backdropRef} className={`${shared} pointer-events-none overflow-auto text-transparent`}>
          {hasPattern ? (
            segments.map((seg, i) =>
              seg.matchOrder === null ? (
                <span key={i}>{seg.text}</span>
              ) : (
                <mark key={i} className={`${HL[seg.matchOrder % HL.length]} text-transparent`}>
                  {seg.text}
                </mark>
              ),
            )
          ) : (
            <span>{text}</span>
          )}
          {/* 末尾补一个换行，保证最后一行高度与 textarea 对齐 */}
          {'\n'}
        </div>

        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          spellCheck={false}
          placeholder="在此粘贴或输入待测试的文本…"
          className={`${shared} resize-none overflow-auto bg-transparent text-slate-100 caret-indigo-400 outline-none placeholder:text-slate-600`}
        />
      </div>
    </section>
  )
}
