import { PRESETS, type Preset } from '../lib/presets'

interface Props {
  onPick: (preset: Preset) => void
}

export function PresetMenu({ onPick }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className="self-center text-xs text-slate-500">示例：</span>
      {PRESETS.map((p) => (
        <button
          key={p.label}
          onClick={() => onPick(p)}
          className="rounded-full border border-slate-700 bg-slate-800/40 px-2.5 py-1 text-xs text-slate-300 transition hover:border-indigo-500/60 hover:text-indigo-200"
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
