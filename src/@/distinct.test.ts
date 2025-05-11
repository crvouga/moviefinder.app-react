import { describe, expect, it } from 'bun:test'
import { distinct } from './distinct'

describe('distinct', () => {
  it('should remove duplicates based on key function', () => {
    const input = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice' },
      { id: 3, name: 'Charlie' },
      { id: 2, name: 'Bob' },
    ]

    const result = distinct(input, (item) => item.id.toString())

    expect(result).toEqual([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ])
  })

  it('should handle empty array', () => {
    const input: { id: number; name: string }[] = []
    const result = distinct(input, (item) => item.id.toString())
    expect(result).toEqual([])
  })

  it('should handle array with no duplicates', () => {
    const input = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ]

    const result = distinct(input, (item) => item.id.toString())

    expect(result).toEqual(input)
  })

  it('should preserve first occurrence of duplicate items', () => {
    const input = [
      { id: 1, name: 'Alice' },
      { id: 1, name: 'Alice Modified' },
      { id: 2, name: 'Bob' },
    ]

    const result = distinct(input, (item) => item.id.toString())

    expect(result).toEqual([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ])
  })
})
