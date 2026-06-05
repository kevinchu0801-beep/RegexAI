import { useState } from 'react'
import { SparklesIcon, SpinnerIcon, CloseIcon } from './icons'

interface Props {
  loading: boolean
  onGenerate: (prompt: string) => void
  onStop: () => void
}

const SAMPLES = ['匹配中国大陆手机号', '提取所有邮箱地址', '匹配 YYYY-MM-DD 日期', '提取 http/https 链接']

export function PromptBar({ loading, onGenerate, onStop }: Props) {
  const [prompt, setPrompt] = useState('')

  function submit() {
    const p = prompt.trim()
    if (p && !loading) onGenerate(p)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <section className="panel p-4">
      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
        <SparklesIcon className="text-indigo-400" />
        用自然语言描述你想匹配什么
      </h2>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="例如：匹配中国大陆手机号"
          className="input flex-1"
        />
        {loading ? (
          <button className="btn-ghost shrink-0" onClick={onStop}>
            <CloseIcon />
            停止
          </button>
        ) : (
          <button className="btn-primary shrink-0" onClick={submit} disabled={!prompt.trim()}>
            <SparklesIcon />
            生成正则
          </button>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {loading && (
          <span className="flex items-center gap-1 text-xs text-indigo-300">
            <SpinnerIcon className="h-3 w-3" /> 生成中…
          </span>
        )}
        {!loading &&
          SAMPLES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setPrompt(s)
                onGenerate(s)
              }}
              className="rounded-full border border-slate-700 bg-slate-800/40 px-2.5 py-1 text-xs text-slate-400 transition hover:border-indigo-500/60 hover:text-indigo-200"
            >
              {s}
            </button>
          ))}
      </div>
    </section>
  )
}
