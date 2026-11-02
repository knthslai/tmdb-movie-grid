import { useEffect, useState } from 'react'

// The value, once it has stopped changing for `delayMs`. Used so search waits for a pause in typing
// instead of sending a request per keystroke.
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}
