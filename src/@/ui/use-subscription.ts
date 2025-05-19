import { LRUCache } from 'lru-cache'
import { useCallback, useEffect, useState } from 'react'
import { Sub } from '../pub-sub'

const valueCache = new LRUCache<string, Record<string, unknown>>({
  max: 1000,
  ttl: 1000 * 60 * 60 * 24,
})

export const useSubscription = <T extends Record<string, unknown>>(
  key: (string | number | symbol | undefined | null | boolean)[],
  createSub: () => Sub<T> | null
): T | null => {
  const keyString = key.join('-')

  const createSubCallback = useCallback(createSub, [keyString])

  const init = (): T | null => {
    const cached = valueCache.get(keyString)
    if (cached) return cached as T
    return null
  }

  const [value, setValue] = useState<T | null>(init)

  useEffect(() => {
    setValue(init)

    const sub = createSubCallback()

    const unsub = sub?.subscribe((value) => {
      setValue(value)
      valueCache.set(keyString, value)
    })

    return () => {
      unsub?.()
    }
  }, [keyString, createSubCallback])

  return value
}
