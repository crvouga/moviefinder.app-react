import { useCallback, useLayoutEffect } from 'react'

import { useState } from 'react'

export type Sub<T> = {
  subscribe: (callback: (value: T) => void) => () => void
  next: (filter: (value: T) => boolean) => Promise<T>
  map: <U>(mapper: (value: T) => U) => Sub<U>
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
  }
}

export const useSubscription = <T>(createSub: () => Sub<T>, deps: unknown[]): T | null => {
  const subCallback = useCallback(() => createSub(), deps)
  const [value, setValue] = useState<T | null>(null)
  useLayoutEffect(() => {
    const sub = subCallback()
    return sub.subscribe((value) => {
      setValue(value)
    })
  }, [subCallback])

  return value
}
