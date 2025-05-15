import { expect, describe, it } from 'bun:test'
import { hashObject } from './hash-object'

describe('hashObject', () => {
  it('should hash same primitive values to same hash', () => {
    expect(hashObject(null)).toBe(hashObject(null))
    expect(hashObject(123)).toBe(hashObject(123))
    expect(hashObject('test')).toBe(hashObject('test'))
    expect(hashObject(true)).toBe(hashObject(true))
  })

  it('should hash different primitive values to different hashes', () => {
    expect(hashObject(null)).not.toBe(hashObject(undefined))
    expect(hashObject(123)).not.toBe(hashObject(456))
    expect(hashObject('test')).not.toBe(hashObject('other'))
    expect(hashObject(true)).not.toBe(hashObject(false))
  })

  it('should hash arrays with same contents to same hash', () => {
    expect(hashObject([1, 2, 3])).toBe(hashObject([1, 2, 3]))
    expect(hashObject(['a', 'b'])).toBe(hashObject(['a', 'b']))
    expect(hashObject([null, true])).toBe(hashObject([null, true]))
  })

  it('should hash arrays with different contents to different hashes', () => {
    expect(hashObject([1, 2, 3])).not.toBe(hashObject([3, 2, 1]))
    expect(hashObject(['a', 'b'])).not.toBe(hashObject(['b', 'a']))
  })

  it('should hash objects with same contents to same hash regardless of key order', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { b: 2, a: 1 }
    expect(hashObject(obj1)).toBe(hashObject(obj2))

    const obj3 = { x: true, y: null }
    const obj4 = { y: null, x: true }
    expect(hashObject(obj3)).toBe(hashObject(obj4))
  })

  it('should hash objects with different contents to different hashes', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 2, b: 1 }
    expect(hashObject(obj1)).not.toBe(hashObject(obj2))
  })

  it('should hash nested structures consistently', () => {
    const nested1 = {
      arr: [1, { x: 'test' }],
      obj: { a: null, b: [true] }
    }
    const nested2 = {
      obj: { b: [true], a: null },
      arr: [1, { x: 'test' }]
    }
    expect(hashObject(nested1)).toBe(hashObject(nested2))

    const nested3 = {
      arr: [1, { x: 'different' }],
      obj: { a: null, b: [true] }
    }
    expect(hashObject(nested1)).not.toBe(hashObject(nested3))
  })
})
