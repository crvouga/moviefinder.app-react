/**
 * Creates a deterministic string representation for any JavaScript value.
 * Objects with the same contents but different key orders will have the same output.
 * @param obj The value to stringify
 * @returns A deterministic string
 */
export const toDeterministicHash = <T>(obj: T): string => {
  return JSON.stringify(obj, (_, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value)
        .sort()
        .reduce((sorted: Record<string, unknown>, key) => {
          sorted[key] = value[key]
          return sorted
        }, {})
    }
    return value
  })
}
