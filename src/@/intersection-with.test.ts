import { describe, expect, it } from 'bun:test'
import { intersectionWith } from './intersection-with'

describe('intersectionWith', () => {
  it('should return intersection of arrays based on custom equality function', () => {
    const a = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]
    const b = [
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ]

    const result = intersectionWith(a, b, (a, b) => a.id === b.id)

    expect(result).toEqual([{ id: 2, name: 'Bob' }])
  })

  it('should return empty array when no intersection exists', () => {
    const a = [{ id: 1, name: 'Alice' }]
    const b = [{ id: 2, name: 'Bob' }]

    const result = intersectionWith(a, b, (a, b) => a.id === b.id)

    expect(result).toEqual([])
  })

  it('should handle empty arrays', () => {
    const a: { id: number }[] = []
    const b = [{ id: 1 }]

    const result = intersectionWith(a, b, (a, b) => a.id === b.id)

    expect(result).toEqual([])
  })

  it('should handle arrays with duplicate items', () => {
    const a = [
      { id: 1, name: 'Alice' },
      { id: 1, name: 'Alice' },
    ]
    const b = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]

    const result = intersectionWith(a, b, (a, b) => a.id === b.id)

    expect(result).toEqual([
      { id: 1, name: 'Alice' },
      { id: 1, name: 'Alice' },
    ])
  })
})
