import { useMemo, useState } from 'react'
import { generateSnippets } from '../lib/codegen'
import { CopyButton } from './CopyButton'
import { CodeIcon } from './icons'

interface Props {
  pattern: string
  flags: string
}

export function ExportPanel({ pattern, flags }: Props) {
  const snippets = useMemo(() => generateSnippets(pattern, flags), [pattern, flags])
  const [active, setActive] = useState(0)
  const current = snippets[active]

  return (
    <section className="panel flex flex-col p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <CodeIcon className="text-indigo-400" />
          导出代码
        </h2>
        <CopyButton value={pattern ? current.code : ''} label="复制" className="px-2 py-1 text-xs" />
      </div>

      <div className="mb-2 flex gap-1">
        {snippets.map((s, i) => (
          <button
            key={s.lang}
            onClick={() => setActive(i)}
            className={
              'rounded-md px-2.5 py-1 text-xs font-medium transition ' +
              (i === active
                ? 'bg-indigo-500/20 text-indigo-200'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200')
            }
          >
            {s.label}
          </button>
        ))}
      </div>

      <pre className="flex-1 overflow-auto rounded-lg border border-slate-800 bg-slate-950/70 p-3 font-mono text-xs leading-relaxed text-slate-200">
        {pattern ? <code>{current.code}</code> : <span className="text-slate-600">先输入或生成一个正则…</span>}
      </pre>
    </section>
  )
}
