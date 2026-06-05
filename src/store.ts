import { useCallback, useEffect, useState } from 'react'

// AI 服务配置（兼容 OpenAI 风格接口，默认对接 DeepSeek）。
// Key 仅保存在浏览器 localStorage，不会离开用户设备。
export interface AiSettings {
  apiKey: string
  baseUrl: string
  model: string
}

export const DEFAULT_SETTINGS: AiSettings = {
  apiKey: '',
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat',
}

const STORAGE_KEY = 'regexai.settings'

function load(): AiSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

/** 读取并持久化 AI 配置的 Hook。 */
export function useSettings() {
  const [settings, setSettings] = useState<AiSettings>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // localStorage 不可用时静默降级
    }
  }, [settings])

  const update = useCallback((patch: Partial<AiSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  return { settings, update }
}
