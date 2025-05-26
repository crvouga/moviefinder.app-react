import { useLayoutEffect, useState } from 'react'
import { Sub } from '../pub-sub'

export const useLiveQuery = <T extends Record<string, unknown>>(input: {
  queryCache: Map<string, Record<string, unknown>>
  queryKey: string
  queryFn: () => Sub<T> | null
}): T | null => {
  const init = (): T | null => {
    const cached = input.queryCache.get(input.queryKey)
    if (cached) return cached as T
    return null
  }

  const init_ = init()
  const [value, setValue] = useState<T | null>(init_)

  useLayoutEffect(() => {
    const init_ = init()
    setValue(init_)
    return input.queryFn()?.subscribe((value) => {
      setValue(value)
      input.queryCache.set(input.queryKey, value)
    })
  }, [input.queryKey])

  return value
}
