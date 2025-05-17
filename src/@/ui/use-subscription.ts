import { useCallback, useLayoutEffect, useState } from 'react'
import { Sub } from '../pub-sub'

const valueCache = new Map<string, unknown>()

export const useSubscription = <T>(
  key: (string | number | symbol | undefined | null | boolean)[],
  createSub: () => Sub<T> | null
): T | null => {
  const keyString = key.join('-')

  const createSubCallback = useCallback(() => createSub(), [keyString])

  const [value, setValue] = useState<T | null>(() => {
    const cached = valueCache.get(keyString)
    if (cached) return cached as T
    return null
  })

  useLayoutEffect(() => {
    const sub = createSubCallback()
    return sub?.subscribe((value) => {
      setValue(value)
      valueCache.set(keyString, value)
    })
  }, [keyString, createSubCallback])

  return value
}
