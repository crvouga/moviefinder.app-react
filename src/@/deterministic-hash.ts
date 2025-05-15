/**
 * Creates a deterministic hash for any JavaScript value, including objects and arrays.
 * Objects with the same contents but different key orders will have the same hash.
 * Performs deep hashing of nested objects and arrays.
 * @param obj The value to hash
 * @returns A deterministic hash string
 */
export const toDeterministicHash = <T>(obj: T): string => {
  // Handle primitive types directly
  if (obj === null) return 'null'
  if (obj === undefined) return 'undefined'
  if (typeof obj === 'number') return `num:${obj}`
  if (typeof obj === 'boolean') return `bool:${obj}`
  if (typeof obj === 'string') return `str:${obj}`

  // Handle arrays by recursively hashing elements
  if (Array.isArray(obj)) {
    return `[${obj.map((item) => toDeterministicHash(item)).join(',')}]`
  }

  // Handle objects by sorting keys and recursively hashing values
  if (typeof obj === 'object') {
    const sortedKeys = Object.keys(obj).sort()
    const pairs = sortedKeys.map((key) => {
      const value = obj[key as keyof T]
      return `${key}:${toDeterministicHash(value)}`
    })
    return `{${pairs.join(',')}}`
  }

  // Fallback for other types
  return `${String(obj)}`
}
