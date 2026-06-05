import { BookIcon, SpinnerIcon, CloseIcon } from './icons'
import { Markdown } from './Markdown'

interface Props {
  text: string
  loading: boolean
  hasPattern: boolean
  onExplain: () => void
  onStop: () => void
}

export function ExplainPanel({ text, loading, hasPattern, onExplain, onStop }: Props) {
  return (
    <section className="panel flex flex-col p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <BookIcon className="text-indigo-400" />
          AI 解释
        </h2>
        {loading ? (
          <button className="btn-ghost px-2 py-1 text-xs" onClick={onStop}>
            <CloseIcon className="h-3.5 w-3.5" />
            停止
          </button>
        ) : (
          <button
            className="btn-ghost px-2 py-1 text-xs"
            onClick={onExplain}
            disabled={!hasPattern}
          >
            <BookIcon className="h-3.5 w-3.5" />
            {text ? '重新解释' : '解释这个正则'}
          </button>
        )}
      </div>

      <div className="min-h-[6rem] flex-1">
        {!text && !loading && (
          <div className="flex h-full min-h-[6rem] items-center justify-center text-center text-xs text-slate-600">
            {hasPattern ? '点击「解释这个正则」让 AI 逐段拆解' : '先输入或生成一个正则'}
          </div>
        )}
        {(text || loading) && (
          <div className="animate-fade-in">
            <Markdown text={text} />
            {loading && (
              <span className="mt-1 inline-flex items-center gap-1 text-xs text-indigo-300">
                <SpinnerIcon className="h-3 w-3" />
                生成中…
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
