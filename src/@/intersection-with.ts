/**
 * Returns the intersection of two arrays, using a function to determine equality.
 * @param a - The first array.
 * @param b - The second array.
 * @param fn - A function that determines if two elements are equal.
 * @returns The intersection of the two arrays.
 * @example
 * ```ts
 * const a = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * const b = [{ id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }]
 * intersectionWith(a, b, (a, b) => a.id === b.id)
 * // Returns: [{ id: 2, name: 'Bob' }]
 * ```
 */
export const intersectionWith = <T>(a: T[], b: T[], fn: (a: T, b: T) => boolean): T[] => {
  return a.filter((a) => b.some((b) => fn(a, b)))
}
