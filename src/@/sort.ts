export type Comparator<T> = (a: T, b: T) => number

export const ascend = <T>(keyFn: (item: T) => unknown): Comparator<T> => {
  return (a, b) => {
    const aKey = keyFn(a)
    const bKey = keyFn(b)
    if (aKey === bKey) return 0
    if (aKey === null || aKey === undefined) return 1
    if (bKey === null || bKey === undefined) return -1
    if (typeof aKey === 'symbol' || typeof bKey === 'symbol') return 0
    return aKey < bKey ? -1 : 1
  }
}

export const descend = <T>(keyFn: (item: T) => unknown): Comparator<T> => {
  return (a, b) => {
    const aKey = keyFn(a)
    const bKey = keyFn(b)
    if (aKey === bKey) return 0
    if (aKey === null || aKey === undefined) return -1
    if (bKey === null || bKey === undefined) return 1
    if (typeof aKey === 'symbol' || typeof bKey === 'symbol') return 0
    return aKey < bKey ? 1 : -1
  }
}

export const isAscend = <T>(items: T[], keyFn: (item: T) => number): boolean => {
  return items.every((item, index) => {
    if (index === 0) return true
    const prev = items[index - 1]
    if (!prev) return true
    return keyFn(item) >= keyFn(prev)
  })
}

export const isDescend = <T>(items: T[], keyFn: (item: T) => number): boolean => {
  return items.every((item, index) => {
    if (index === 0) return true
    const prev = items[index - 1]
    if (!prev) return true
    return keyFn(item) <= keyFn(prev)
  })
}

const combine = <T>(comparators: Comparator<T>[]): Comparator<T> => {
  return (a, b) => {
    for (const comparator of comparators) {
      const result = comparator(a, b)
      if (result !== 0) return result
    }
    return 0
  }
}
export const Comparator = {
  combine,
}
