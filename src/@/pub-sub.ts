import { useCallback, useEffect, useState } from 'react'

export type Sub<T> = {
  subscribe: (callback: (value: T) => void) => () => void
  next: (filter: (value: T) => boolean) => Promise<T>
  map: <U>(mapper: (value: T) => U) => Sub<U>
  mapAsync: <U>(mapper: (value: T) => Promise<U>) => Sub<U>
}

export type Pub<T> = {
  publish: (value: T) => void
}

export type PubSub<T> = Pub<T> & Sub<T>

export const PubSub = <T>(): PubSub<T> => {
  const subscribers = new Set<(value: T) => void>()

  return {
    subscribe(subscriber) {
      subscribers.add(subscriber)
      return () => {
        subscribers.delete(subscriber)
      }
    },
    publish(value) {
      for (const subscriber of subscribers) {
        subscriber(value)
      }
    },
    next(filter) {
      return new Promise((resolve) => {
        const unsubscribe = this.subscribe((value) => {
          if (filter(value)) {
            resolve(value)
            unsubscribe()
          }
        })
      })
    },
    map(mapper) {
      const pubSub = PubSub<ReturnType<typeof mapper>>()

      this.subscribe((value) => {
        pubSub.publish(mapper(value))
      })

      return pubSub
    },
    mapAsync(mapper) {
      const pubSub = PubSub<Awaited<ReturnType<typeof mapper>>>()

      this.subscribe(async (value) => {
        pubSub.publish(await mapper(value))
      })

      return pubSub
    },
  }
}

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

  useEffect(() => {
    const sub = createSubCallback()
    return sub?.subscribe((value) => {
      setValue(value)
      valueCache.set(keyString, value)
    })
  }, [keyString, createSubCallback])

  return value
}
