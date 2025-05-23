import { describe, expect, it } from 'bun:test'
import { intersectionWith } from '~/@/intersection-with'
import { Pagination } from '~/@/pagination/pagination'
import { unwrap } from '~/@/result'
import { Fixtures } from './fixture'

describe('MediaDb Pagination', () => {
  it('should work for limit 20', async () => {
    for (const f of await Fixtures(['sql-db'])) {
      const PAGE_SIZE = 20
      const page1 = unwrap(await f.mediaDb.query({ limit: PAGE_SIZE, offset: 0 }))
      const page2 = unwrap(await f.mediaDb.query(Pagination.nextPage(page1.entities)))

      expect(page2.entities.items.length).toBeLessThanOrEqual(page1.entities.total)

      expect(
        intersectionWith(page1.entities.items, page2.entities.items, (a, b) => a.id === b.id)
      ).toEqual([])

      expect(page1.entities.items.length).toBeLessThanOrEqual(PAGE_SIZE)
      expect(page2.entities.items.length).toBeLessThanOrEqual(PAGE_SIZE)
    }
  })

  it('should work for limit 3', async () => {
    for (const f of await Fixtures(['sql-db'])) {
      const page1 = unwrap(await f.mediaDb.query({ limit: 3, offset: 0 }))
      const page2 = unwrap(await f.mediaDb.query(Pagination.nextPage(page1.entities)))

      expect(page1.entities.items.length).toBeLessThanOrEqual(page2.entities.total)
      expect(page2.entities.items.length).toBeLessThanOrEqual(page1.entities.total)

      expect(
        intersectionWith(page1.entities.items, page2.entities.items, (a, b) => a.id === b.id)
      ).toEqual([])
    }
  })
})
