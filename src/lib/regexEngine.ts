// 本地正则引擎：在浏览器中计算匹配、捕获组，并把文本切分为高亮片段。
// 所有计算均为纯函数，便于测试与复用。

export interface CaptureGroup {
  /** 组序号，从 1 开始 */
  index: number
  /** 命名捕获组的名字（若有） */
  name?: string
  /** 该组捕获到的内容，未参与匹配时为 undefined */
  value: string | undefined
}

export interface RegexMatch {
  /** 第几个匹配（从 0 开始） */
  order: number
  /** 完整匹配文本 */
  value: string
  /** 在原文中的起始/结束下标 */
  start: number
  end: number
  groups: CaptureGroup[]
}

export interface Segment {
  text: string
  /** null 表示未命中；数字表示属于第几个匹配 */
  matchOrder: number | null
}

export interface RegexResult {
  ok: boolean
  error?: string
  matches: RegexMatch[]
  segments: Segment[]
}

/** 防止灾难性回溯卡死页面的上限 */
const MAX_MATCHES = 50000

function emptyResult(text: string): RegexResult {
  return { ok: true, matches: [], segments: [{ text, matchOrder: null }] }
}

/**
 * 执行正则并返回匹配详情与高亮片段。
 * - 当 flags 含 g 时收集全部匹配，否则只取第一个匹配。
 * - 自动跳过零宽匹配，避免死循环。
 */
export function runRegex(pattern: string, flags: string, text: string): RegexResult {
  if (!pattern) return emptyResult(text)

  let re: RegExp
  try {
    re = new RegExp(pattern, flags)
  } catch (err) {
    return {
      ok: false,
      error: (err as Error).message,
      matches: [],
      segments: [{ text, matchOrder: null }],
    }
  }

  const global = flags.includes('g') || flags.includes('y')
  const matches: RegexMatch[] = []

  try {
    if (global) {
      let m: RegExpExecArray | null
      while ((m = re.exec(text)) !== null) {
        matches.push(toMatch(m, matches.length))
        // 处理零宽匹配，强制前进，避免无限循环
        if (m.index === re.lastIndex) re.lastIndex++
        if (matches.length >= MAX_MATCHES) break
      }
    } else {
      const m = re.exec(text)
      if (m) matches.push(toMatch(m, 0))
    }
  } catch (err) {
    return {
      ok: false,
      error: (err as Error).message,
      matches: [],
      segments: [{ text, matchOrder: null }],
    }
  }

  return { ok: true, matches, segments: buildSegments(text, matches) }
}

function toMatch(m: RegExpExecArray, order: number): RegexMatch {
  const start = m.index
  const value = m[0]
  const namedEntries = m.groups ? Object.entries(m.groups) : []
  const groups: CaptureGroup[] = []
  for (let i = 1; i < m.length; i++) {
    const named = namedEntries.find(([, v]) => v === m[i])
    groups.push({ index: i, name: named?.[0], value: m[i] })
  }
  return { order, value, start, end: start + value.length, groups }
}

/** 把原文按匹配区间切成「命中 / 未命中」片段，用于安全渲染高亮。 */
function buildSegments(text: string, matches: RegexMatch[]): Segment[] {
  if (matches.length === 0) return [{ text, matchOrder: null }]

  const segments: Segment[] = []
  let cursor = 0
  for (const m of matches) {
    // 跳过重叠 / 越界的异常情况
    if (m.start < cursor) continue
    if (m.start > cursor) {
      segments.push({ text: text.slice(cursor, m.start), matchOrder: null })
    }
    segments.push({ text: text.slice(m.start, m.end), matchOrder: m.order })
    cursor = m.end
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), matchOrder: null })
  }
  return segments
}

export const ALL_FLAGS: { flag: string; label: string; desc: string }[] = [
  { flag: 'g', label: 'global', desc: '全局匹配，查找所有结果' },
  { flag: 'i', label: 'ignoreCase', desc: '忽略大小写' },
  { flag: 'm', label: 'multiline', desc: '多行模式，^ $ 匹配每行首尾' },
  { flag: 's', label: 'dotAll', desc: '让 . 匹配换行符' },
  { flag: 'u', label: 'unicode', desc: 'Unicode 模式' },
  { flag: 'y', label: 'sticky', desc: '粘连匹配，从 lastIndex 开始' },
]
