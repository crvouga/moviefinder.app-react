import { describe, expect, it } from 'bun:test'
import { intersectionWith } from '~/@/intersection-with'
import { Pagination } from '~/@/pagination/pagination'
import { unwrap } from '~/@/result'
import { Fixtures } from './fixture'

describe.only('MediaDb Pagination', () => {
  it('should work for limit 20', async () => {
    for (const f of await Fixtures(['db-conn'])) {
      const PAGE_SIZE = 20
      const page1 = unwrap(await f.mediaDb.query({ limit: PAGE_SIZE, offset: 0 }))
      const page2 = unwrap(await f.mediaDb.query(Pagination.nextPage(page1.media)))

      expect(page2.media.items.length).toBeLessThanOrEqual(page1.media.total)

      expect(
        intersectionWith(page1.media.items, page2.media.items, (a, b) => a.id === b.id)
      ).toEqual([])

      expect(page1.media.items.length).toBeLessThanOrEqual(PAGE_SIZE)
      expect(page2.media.items.length).toBeLessThanOrEqual(PAGE_SIZE)
    }
  })

  it('should work for limit 3', async () => {
    for (const f of await Fixtures(['db-conn'])) {
      const page1 = unwrap(await f.mediaDb.query({ limit: 3, offset: 0 }))
      const page2 = unwrap(await f.mediaDb.query(Pagination.nextPage(page1.media)))

      expect(page1.media.items.length).toBeLessThanOrEqual(page2.media.total)
      expect(page2.media.items.length).toBeLessThanOrEqual(page1.media.total)

      expect(
        intersectionWith(page1.media.items, page2.media.items, (a, b) => a.id === b.id)
      ).toEqual([])
    }
  })
})
