import { FlagToggles } from './FlagToggles'
import { CopyButton } from './CopyButton'
import { AlertIcon, SpinnerIcon } from './icons'

interface Props {
  pattern: string
  flags: string
  error?: string
  matchCount: number
  streaming?: boolean
  onPatternChange: (v: string) => void
  onFlagsChange: (v: string) => void
}

export function RegexEditor({
  pattern,
  flags,
  error,
  matchCount,
  streaming,
  onPatternChange,
  onFlagsChange,
}: Props) {
  return (
    <section className="panel p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          正则表达式
          {streaming && <SpinnerIcon className="h-3.5 w-3.5 text-indigo-400" />}
        </h2>
        <div className="flex items-center gap-2">
          {!error && pattern && (
            <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
              {matchCount} 处匹配
            </span>
          )}
          <CopyButton value={pattern ? `/${pattern}/${flags}` : ''} />
        </div>
      </div>

      <div
        className={
          'flex items-stretch overflow-hidden rounded-lg border bg-slate-950/70 font-mono ' +
          (error ? 'border-rose-500/70' : 'border-slate-700 focus-within:border-indigo-500')
        }
      >
        <span className="flex select-none items-center px-2 text-lg text-slate-500">/</span>
        <input
          value={pattern}
          onChange={(e) => onPatternChange(e.target.value)}
          spellCheck={false}
          placeholder="在此输入或由 AI 生成正则…"
          className="flex-1 bg-transparent py-2.5 text-sm text-emerald-300 outline-none placeholder:text-slate-600"
        />
        <span className="flex select-none items-center px-1 text-lg text-slate-500">/</span>
        <span className="flex select-none items-center pr-3 text-sm text-amber-300">{flags}</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <FlagToggles flags={flags} onChange={onFlagsChange} />
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300 animate-fade-in">
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="break-all">非法正则：{error}</span>
        </div>
      )}
    </section>
  )
}
