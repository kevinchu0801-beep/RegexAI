import { useState } from 'react'
import type { AiSettings } from '../store'
import { DEFAULT_SETTINGS } from '../store'
import { CloseIcon } from './icons'

interface Props {
  open: boolean
  settings: AiSettings
  onClose: () => void
  onSave: (patch: Partial<AiSettings>) => void
}

export function SettingsDialog({ open, settings, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<AiSettings>(settings)

  if (!open) return null

  function set<K extends keyof AiSettings>(key: K, value: AiSettings[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function handleSave() {
    onSave(draft)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="panel w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">AI 设置</h2>
          <button className="btn-icon" onClick={onClose} title="关闭">
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4">
          <Field label="API Key" hint="仅保存在本地浏览器，不会上传到任何服务器">
            <input
              type="password"
              value={draft.apiKey}
              onChange={(e) => set('apiKey', e.target.value)}
              placeholder="sk-..."
              className="input"
              autoFocus
            />
          </Field>

          <Field label="接口地址 Base URL" hint="OpenAI 兼容接口，默认对接 DeepSeek">
            <input
              value={draft.baseUrl}
              onChange={(e) => set('baseUrl', e.target.value)}
              placeholder={DEFAULT_SETTINGS.baseUrl}
              className="input"
            />
          </Field>

          <Field label="模型">
            <input
              value={draft.model}
              onChange={(e) => set('model', e.target.value)}
              placeholder={DEFAULT_SETTINGS.model}
              className="input"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {['deepseek-chat', 'gpt-4o-mini', 'qwen-plus'].map((m) => (
                <button
                  key={m}
                  onClick={() => set('model', m)}
                  className="rounded-md border border-slate-700 bg-slate-800/40 px-2 py-1 text-xs text-slate-400 transition hover:text-slate-200"
                >
                  {m}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            没有 Key？可在 DeepSeek / OpenAI 开放平台申请。
          </p>
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={onClose}>
              取消
            </button>
            <button className="btn-primary" onClick={handleSave}>
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-300">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  )
}
