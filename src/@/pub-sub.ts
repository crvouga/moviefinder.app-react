import { useEffect } from 'react'

export type Sub<T> = {
  subscribe: (callback: (value: T) => void) => () => void
  next: (filter: (value: T) => boolean) => Promise<T>
  map: <U>(mapper: (value: T) => U) => Sub<U>
  mapAsync: <U>(mapper: (value: T) => Promise<U>) => Sub<U>
  subscriberCount: () => number
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
    subscriberCount() {
      return subscribers.size
    },
  }
}

export const useSub = <T>(pubSub: PubSub<T>, callback: (value: T) => void) => {
  useEffect(() => {
    return pubSub.subscribe(callback)
  }, [pubSub, callback])
}
