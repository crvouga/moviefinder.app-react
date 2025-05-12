export type Comparator<T> = (a: T, b: T) => number

export const ascend = <T>(keyFn: (item: T) => number): Comparator<T> => {
  return (a, b) => keyFn(a) - keyFn(b)
}

export const descend = <T>(keyFn: (item: T) => number): Comparator<T> => {
  return (a, b) => keyFn(b) - keyFn(a)
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
