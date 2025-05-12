import { useCallback, useEffect } from 'react'

import { useState } from 'react'

export type Sub<T> = {
  subscribe: (callback: (value: T) => void) => () => void
  next: (filter: (value: T) => boolean) => Promise<T>
  map: <U>(mapper: (value: T) => U) => Sub<U>
}

export type Pub<T> = {
  publish: (value: T) => void
}

export type PubSub<T> = Sub<T> & Pub<T>

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
        this.subscribe((value) => {
          if (filter(value)) {
            resolve(value)
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

export const useLatestValue = <T, U>(
  initial: U,
  createSub: () => Sub<T>,
  deps: unknown[]
): T | U => {
  const subCallback = useCallback(() => createSub(), deps)

  const [value, setValue] = useState<T | U>(initial)

  useEffect(() => {
    const sub = subCallback()
    return sub.subscribe((value) => {
      setValue(value)
    })
  }, [subCallback])
  return value
}
