import { describe, expect, test } from 'bun:test'
import { isAscend, isDescend } from './sort'

describe('sort', () => {
  test('isAscend', () => {
    expect(isAscend([1, 2, 3, 4, 5], (x) => x)).toBe(true)
    expect(isAscend([5, 4, 3, 2, 1], (x) => x)).toBe(false)
  })
  test('isDescend', () => {
    expect(isDescend([1, 2, 3, 4, 5], (x) => x)).toBe(false)
    expect(isDescend([5, 4, 3, 2, 1], (x) => x)).toBe(true)
  })
})
