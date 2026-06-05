import { ALL_FLAGS } from '../lib/regexEngine'

interface Props {
  flags: string
  onChange: (flags: string) => void
}

export function FlagToggles({ flags, onChange }: Props) {
  function toggle(flag: string) {
    if (flags.includes(flag)) {
      onChange(flags.replace(flag, ''))
    } else {
      // 保持与 ALL_FLAGS 一致的顺序
      const next = ALL_FLAGS.filter((f) => flags.includes(f.flag) || f.flag === flag)
        .map((f) => f.flag)
        .join('')
      onChange(next)
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {ALL_FLAGS.map((f) => {
        const active = flags.includes(f.flag)
        return (
          <button
            key={f.flag}
            onClick={() => toggle(f.flag)}
            title={`${f.label} · ${f.desc}`}
            className={
              'rounded-md border px-2 py-1 font-mono text-xs transition ' +
              (active
                ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200'
                : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200')
            }
          >
            {f.flag}
          </button>
        )
      })}
    </div>
  )
}
