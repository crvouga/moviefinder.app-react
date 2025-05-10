import { describe, expect, it } from 'bun:test'
import { Pagination } from './pagination'

describe('Pagination', () => {
  describe('nextPage', () => {
    it('should increment offset by limit', () => {
      const pagination = { limit: 10, offset: 0 }
      const next = Pagination.nextPage(pagination)

      expect(next).toEqual({ limit: 10, offset: 10 })
    })

    it('should maintain limit value', () => {
      const pagination = { limit: 5, offset: 15 }
      const next = Pagination.nextPage(pagination)

      expect(next.limit).toBe(5)
    })
  })

  describe('prevPage', () => {
    it('should decrement offset by limit', () => {
      const pagination = { limit: 10, offset: 20 }
      const prev = Pagination.prevPage(pagination)

      expect(prev).toEqual({ limit: 10, offset: 10 })
    })

    it('should maintain limit value', () => {
      const pagination = { limit: 5, offset: 15 }
      const prev = Pagination.prevPage(pagination)

      expect(prev.limit).toBe(5)
    })
  })
})
