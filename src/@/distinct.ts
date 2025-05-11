/**
 * Returns an array with duplicate elements removed based on a key function.
 * @param a - The array to remove duplicates from.
 * @param fn - A function that returns a key to determine uniqueness.
 * @returns A new array with duplicates removed.
 * @example
 * ```ts
 * const a = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 1, name: 'Alice' }]
 * distinct(a, (a) => a.id)
 * // Returns: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * ```
 */
export const distinct = <T>(a: T[], fn: (a: T) => string): T[] => {
  return a.filter((a, index, self) => self.findIndex((t) => fn(t) === fn(a)) === index)
}
