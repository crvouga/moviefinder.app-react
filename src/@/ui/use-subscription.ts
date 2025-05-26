import { useLayoutEffect, useState } from 'react'
import { Sub } from '../pub-sub'

export const useSubscription = <T extends Record<string, unknown>>(input: {
  subCache: Map<string, Record<string, unknown>>
  subKey: string
  subFn: () => Sub<T> | null
}): T | null => {
  const init = (): T | null => {
    const cached = input.subCache.get(input.subKey)
    if (cached) return cached as T
    return null
  }

  const [value, setValue] = useState<T | null>(init)

  useLayoutEffect(() => {
    const init_ = init()
    setValue(init_)
    return input.subFn()?.subscribe((value) => {
      setValue(value)
      input.subCache.set(input.subKey, value)
    })
  }, [input.subKey])

  return value
}
