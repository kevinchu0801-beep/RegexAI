import { useEffect, useState } from 'react'

/** 返回 value 的防抖版本，delay 毫秒内的连续变更只保留最后一次。 */
export function useDebounced<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
