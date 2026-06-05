import type { AiSettings } from '../store'

// 浏览器直连大模型（OpenAI 兼容接口）的流式客户端。
// 通过抽象 streamChat，未来若改为自建 Serverless 代理，只需替换此文件实现。

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface StreamOptions {
  onToken?: (delta: string, full: string) => void
  signal?: AbortSignal
}

export class AiError extends Error {}

/** 以 SSE 流式方式调用 chat completions，逐 token 回调，返回完整文本。 */
export async function streamChat(
  messages: ChatMessage[],
  settings: AiSettings,
  options: StreamOptions = {},
): Promise<string> {
  if (!settings.apiKey) {
    throw new AiError('尚未配置 API Key，请先在右上角设置中填写。')
  }

  const url = `${settings.baseUrl.replace(/\/$/, '')}/chat/completions`

  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model,
        messages,
        stream: true,
        temperature: 0.2,
      }),
      signal: options.signal,
    })
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err
    throw new AiError('网络请求失败，请检查网络或接口地址是否正确。')
  }

  if (!res.ok || !res.body) {
    let detail = ''
    try {
      const data = await res.json()
      detail = data?.error?.message ?? ''
    } catch {
      detail = res.statusText
    }
    throw new AiError(`接口返回错误（${res.status}）：${detail || '未知错误'}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let full = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // SSE 以空行分隔事件，逐行解析 data: 字段
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const payload = trimmed.slice(5).trim()
      if (payload === '[DONE]') continue
      try {
        const json = JSON.parse(payload)
        const delta: string = json?.choices?.[0]?.delta?.content ?? ''
        if (delta) {
          full += delta
          options.onToken?.(delta, full)
        }
      } catch {
        // 忽略无法解析的心跳/分片行
      }
    }
  }

  return full
}

const GENERATE_SYSTEM = `你是正则表达式专家。根据用户的自然语言需求，生成一个用于 JavaScript 的正则表达式。
严格要求：
1. 只输出正则表达式本体，不要包含两端的斜杠分隔符。
2. 不要输出 flags、解释、Markdown 代码块或任何多余文字。
3. 如果需求适合多行/忽略大小写等，仍只输出 pattern 本体。
直接输出 pattern：`

/** 自然语言 -> 正则 pattern（流式）。返回去除多余空白后的 pattern。 */
export async function generateRegex(
  prompt: string,
  settings: AiSettings,
  options: StreamOptions = {},
): Promise<string> {
  const messages: ChatMessage[] = [
    { role: 'system', content: GENERATE_SYSTEM },
    { role: 'user', content: prompt },
  ]
  const raw = await streamChat(messages, settings, options)
  return sanitizePattern(raw)
}

/** 清理模型可能附带的代码块标记 / 斜杠 / 换行。 */
export function sanitizePattern(raw: string): string {
  let s = raw.trim()
  // 去掉 ```...``` 代码块
  s = s.replace(/^```[a-z]*\n?/i, '').replace(/```$/i, '').trim()
  // 取第一行非空内容
  s = s.split('\n').map((l) => l.trim()).find((l) => l.length > 0) ?? s
  // 去掉形如 /pattern/flags 的外层斜杠
  const m = s.match(/^\/(.*)\/[gimsuy]*$/)
  if (m) s = m[1]
  return s.trim()
}

const EXPLAIN_SYSTEM = `你是正则表达式专家。请用简体中文解释给定的正则表达式。
要求：
1. 用简洁的 Markdown，先一句话概括用途。
2. 然后用列表逐段拆解每个组成部分的作用。
3. 最后给出 1 个能匹配的示例和 1 个不能匹配的示例。
不要输出与解释无关的内容。`

/** 解释当前正则（流式）。 */
export async function explainRegex(
  pattern: string,
  flags: string,
  settings: AiSettings,
  options: StreamOptions = {},
): Promise<string> {
  const messages: ChatMessage[] = [
    { role: 'system', content: EXPLAIN_SYSTEM },
    { role: 'user', content: `正则：/${pattern}/${flags}` },
  ]
  return streamChat(messages, settings, options)
}
