import { useLayoutEffect, useState } from 'react'
import { Sub } from '../pub-sub'

const valueCache = new Map<string, Record<string, unknown>>()

export const useSubscription = <T extends Record<string, unknown>>(
  key: (string | number | symbol | undefined | null | boolean)[],
  createSub: () => Sub<T> | null
): T | null => {
  const keyString = key.join('-')

  const init = (): T | null => {
    const cached = valueCache.get(keyString)
    if (cached) return cached as T
    return null
  }

  const [value, setValue] = useState<T | null>(init)

  useLayoutEffect(() => {
    setValue(init)
    return createSub()?.subscribe((value) => {
      setValue(value)
      valueCache.set(keyString, value)
    })
  }, [keyString])

  return value
}
