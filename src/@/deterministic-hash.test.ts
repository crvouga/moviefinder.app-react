import { expect, describe, it } from 'bun:test'
import { toDeterministicHash } from './deterministic-hash'

describe('hashObject', () => {
  it('should hash same primitive values to same hash', () => {
    expect(toDeterministicHash(null)).toBe(toDeterministicHash(null))
    expect(toDeterministicHash(123)).toBe(toDeterministicHash(123))
    expect(toDeterministicHash('test')).toBe(toDeterministicHash('test'))
    expect(toDeterministicHash(true)).toBe(toDeterministicHash(true))
  })

  it('should hash different primitive values to different hashes', () => {
    expect(toDeterministicHash(null)).not.toBe(toDeterministicHash(undefined))
    expect(toDeterministicHash(123)).not.toBe(toDeterministicHash(456))
    expect(toDeterministicHash('test')).not.toBe(toDeterministicHash('other'))
    expect(toDeterministicHash(true)).not.toBe(toDeterministicHash(false))
  })

  it('should hash arrays with same contents to same hash', () => {
    expect(toDeterministicHash([1, 2, 3])).toBe(toDeterministicHash([1, 2, 3]))
    expect(toDeterministicHash(['a', 'b'])).toBe(toDeterministicHash(['a', 'b']))
    expect(toDeterministicHash([null, true])).toBe(toDeterministicHash([null, true]))
  })

  it('should hash arrays with different contents to different hashes', () => {
    expect(toDeterministicHash([1, 2, 3])).not.toBe(toDeterministicHash([3, 2, 1]))
    expect(toDeterministicHash(['a', 'b'])).not.toBe(toDeterministicHash(['b', 'a']))
  })

  it('should hash objects with same contents to same hash regardless of key order', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { b: 2, a: 1 }
    expect(toDeterministicHash(obj1)).toBe(toDeterministicHash(obj2))

    const obj3 = { x: true, y: null }
    const obj4 = { y: null, x: true }
    expect(toDeterministicHash(obj3)).toBe(toDeterministicHash(obj4))
  })

  it('should hash objects with different contents to different hashes', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 2, b: 1 }
    expect(toDeterministicHash(obj1)).not.toBe(toDeterministicHash(obj2))
  })

  it('should hash nested structures consistently', () => {
    const nested1 = {
      arr: [1, { x: 'test' }],
      obj: { a: null, b: [true] },
    }
    const nested2 = {
      obj: { b: [true], a: null },
      arr: [1, { x: 'test' }],
    }
    expect(toDeterministicHash(nested1)).toBe(toDeterministicHash(nested2))

    const nested3 = {
      arr: [1, { x: 'different' }],
      obj: { a: null, b: [true] },
    }
    expect(toDeterministicHash(nested1)).not.toBe(toDeterministicHash(nested3))
  })
})
