import type { RegexMatch } from '../lib/regexEngine'

interface Props {
  matches: RegexMatch[]
  hasPattern: boolean
  error?: string
}

export function MatchList({ matches, hasPattern, error }: Props) {
  return (
    <section className="panel flex min-h-[12rem] flex-col p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-300">匹配详情</h2>
        {matches.length > 0 && (
          <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
            共 {matches.length} 个
          </span>
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-auto">
        {!hasPattern && <Empty text="输入正则后将在此显示每个匹配与捕获组" />}
        {hasPattern && error && <Empty text="正则有误，修正后再查看匹配" />}
        {hasPattern && !error && matches.length === 0 && <Empty text="没有匹配到任何内容" />}

        {matches.map((m) => (
          <div
            key={m.order}
            className="rounded-lg border border-slate-800 bg-slate-950/50 p-2.5 animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 font-mono text-xs text-indigo-300">
                #{m.order + 1}
              </span>
              <code className="break-all font-mono text-sm text-emerald-300">{m.value || '(空)'}</code>
              <span className="ml-auto shrink-0 text-xs text-slate-500">
                [{m.start}, {m.end})
              </span>
            </div>

            {m.groups.length > 0 && (
              <div className="mt-2 space-y-1 border-t border-slate-800 pt-2">
                {m.groups.map((g) => (
                  <div key={g.index} className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-slate-500">
                      {g.name ? `<${g.name}>` : `组 ${g.index}`}
                    </span>
                    <code className="break-all font-mono text-amber-300">
                      {g.value === undefined ? '未捕获' : g.value || '(空)'}
                    </code>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex h-full min-h-[6rem] items-center justify-center text-center text-xs text-slate-600">
      {text}
    </div>
  )
}
