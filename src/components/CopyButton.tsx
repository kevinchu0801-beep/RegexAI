import { useState } from 'react'
import { CheckIcon, CopyIcon } from './icons'

interface Props {
  value: string
  className?: string
  label?: string
}

export function CopyButton({ value, className, label }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // 退化方案：部分浏览器/非安全上下文不支持 clipboard API
      const ta = document.createElement('textarea')
      ta.value = value
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  if (label) {
    return (
      <button onClick={handleCopy} className={`btn-ghost ${className ?? ''}`} disabled={!value}>
        {copied ? <CheckIcon className="text-emerald-400" /> : <CopyIcon />}
        <span>{copied ? '已复制' : label}</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleCopy}
      className={`btn-icon ${className ?? ''}`}
      disabled={!value}
      title="复制"
    >
      {copied ? <CheckIcon className="text-emerald-400" /> : <CopyIcon />}
    </button>
  )
}
