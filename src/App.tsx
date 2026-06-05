import { useMemo, useRef, useState } from 'react'
import { useSettings } from './store'
import { useDebounced } from './hooks/useDebounced'
import { runRegex } from './lib/regexEngine'
import { AiError, explainRegex, generateRegex } from './lib/aiClient'
import type { Preset } from './lib/presets'

import { PromptBar } from './components/PromptBar'
import { RegexEditor } from './components/RegexEditor'
import { TestArea } from './components/TestArea'
import { MatchList } from './components/MatchList'
import { ExplainPanel } from './components/ExplainPanel'
import { ExportPanel } from './components/ExportPanel'
import { PresetMenu } from './components/PresetMenu'
import { SettingsDialog } from './components/SettingsDialog'
import { SettingsIcon, SparklesIcon, GithubIcon, AlertIcon } from './components/icons'

export default function App() {
  const { settings, update } = useSettings()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [text, setText] = useState(
    '把测试文本粘贴到这里。\n例如手机号 13800138000、邮箱 alice@example.com、链接 https://example.com',
  )

  const [generating, setGenerating] = useState(false)
  const [explaining, setExplaining] = useState(false)
  const [explainText, setExplainText] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const genAbort = useRef<AbortController | null>(null)
  const explainAbort = useRef<AbortController | null>(null)

  const debouncedText = useDebounced(text, 150)
  const result = useMemo(
    () => runRegex(pattern, flags, debouncedText),
    [pattern, flags, debouncedText],
  )

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  function ensureKey(): boolean {
    if (!settings.apiKey) {
      showToast('请先在右上角设置中填写 API Key')
      setSettingsOpen(true)
      return false
    }
    return true
  }

  async function handleGenerate(prompt: string) {
    if (!ensureKey()) return
    genAbort.current?.abort()
    const ctrl = new AbortController()
    genAbort.current = ctrl
    setGenerating(true)
    setPattern('')
    try {
      await generateRegex(prompt, settings, {
        signal: ctrl.signal,
        onToken: (_d, full) => setPattern(full.replace(/\n/g, '')),
      })
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        showToast(err instanceof AiError ? err.message : '生成失败，请稍后重试')
      }
    } finally {
      setGenerating(false)
    }
  }

  async function handleExplain() {
    if (!pattern || !ensureKey()) return
    explainAbort.current?.abort()
    const ctrl = new AbortController()
    explainAbort.current = ctrl
    setExplaining(true)
    setExplainText('')
    try {
      await explainRegex(pattern, flags, settings, {
        signal: ctrl.signal,
        onToken: (_d, full) => setExplainText(full),
      })
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        showToast(err instanceof AiError ? err.message : '解释失败，请稍后重试')
      }
    } finally {
      setExplaining(false)
    }
  }

  function applyPreset(p: Preset) {
    setPattern(p.pattern)
    setFlags(p.flags)
    setText(p.sample)
    setExplainText('')
  }

  const hasPattern = pattern.length > 0

  return (
    <div className="mx-auto flex min-h-full max-w-6xl flex-col px-4 py-6">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/20">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">RegexAI</h1>
            <p className="text-xs text-slate-500">自然语言生成正则 · 实时高亮测试 · 多语言导出</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={
              'mr-1 hidden items-center gap-1 rounded-full px-2 py-1 text-xs sm:flex ' +
              (settings.apiKey
                ? 'bg-emerald-500/15 text-emerald-300'
                : 'bg-slate-800 text-slate-500')
            }
          >
            <span
              className={
                'h-1.5 w-1.5 rounded-full ' +
                (settings.apiKey ? 'bg-emerald-400' : 'bg-slate-500')
              }
            />
            {settings.apiKey ? '已连接 AI' : '未配置 Key'}
          </span>
          <a
            className="btn-icon"
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            title="源码"
          >
            <GithubIcon />
          </a>
          <button className="btn-icon" onClick={() => setSettingsOpen(true)} title="设置">
            <SettingsIcon />
          </button>
        </div>
      </header>

      <main className="grid flex-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <PromptBar
            loading={generating}
            onGenerate={handleGenerate}
            onStop={() => genAbort.current?.abort()}
          />
          <RegexEditor
            pattern={pattern}
            flags={flags}
            error={result.error}
            matchCount={result.matches.length}
            streaming={generating}
            onPatternChange={setPattern}
            onFlagsChange={setFlags}
          />
          <PresetMenu onPick={applyPreset} />
          <TestArea
            text={text}
            segments={result.segments}
            hasPattern={hasPattern && !result.error}
            onChange={setText}
          />
        </div>

        <div className="flex flex-col gap-4">
          <MatchList matches={result.matches} hasPattern={hasPattern} error={result.error} />
          <ExplainPanel
            text={explainText}
            loading={explaining}
            hasPattern={hasPattern}
            onExplain={handleExplain}
            onStop={() => explainAbort.current?.abort()}
          />
          <ExportPanel pattern={pattern} flags={flags} />
        </div>
      </main>

      <footer className="mt-8 text-center text-xs text-slate-600">
        纯前端应用 · API Key 仅保存在你的浏览器本地 · 使用 React + TypeScript + Vite 构建
      </footer>

      <SettingsDialog
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onSave={update}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-rose-500/40 bg-rose-500/15 px-4 py-2 text-sm text-rose-200 shadow-lg animate-fade-in">
          <AlertIcon className="h-4 w-4" />
          {toast}
        </div>
      )}
    </div>
  )
}
