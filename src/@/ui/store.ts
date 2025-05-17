export type Store<T> = {
  subscribe: (onStoreChange: () => void) => () => void
  getSnapshot: () => T
  update: (updater: (state: T) => T) => void
}
export const Store = <T>(initialState: T): Store<T> => {
  let state: T = initialState
  const subscribers = new Set<() => void>()
  return {
    subscribe: (onStoreChange: () => void) => {
      subscribers.add(onStoreChange)
      return () => {
        subscribers.delete(onStoreChange)
      }
    },
    getSnapshot: () => {
      return state
    },
    update: (updater: (state: T) => T) => {
      state = updater(state)
      subscribers.forEach((subscriber) => {
        subscriber()
      })
    },
  }
}
