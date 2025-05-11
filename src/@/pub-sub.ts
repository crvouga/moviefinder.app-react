export type Sub<T> = {
  subscribe: (callback: (value: T) => void) => () => void
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
  }
}
