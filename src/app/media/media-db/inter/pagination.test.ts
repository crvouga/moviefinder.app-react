import { describe, expect, it } from 'bun:test'
import { intersectionWith } from '~/@/intersection-with'
import { Pagination } from '~/@/pagination/pagination'
import { unwrap } from '~/@/result'
import { Fixture } from './fixture'

describe('MediaDb Pagination', () => {
  it('should work', async () => {
    const f = await Fixture()

    const page1 = unwrap(await f.mediaDb.query({ limit: 10, offset: 0 }))
    const page2 = unwrap(await f.mediaDb.query(Pagination.nextPage(page1.media)))

    expect(page1.media.items.length).toBeLessThanOrEqual(page2.media.total)
    expect(page2.media.items.length).toBeLessThanOrEqual(page1.media.total)

    expect(
      intersectionWith(page1.media.items, page2.media.items, (a, b) => a.id === b.id).length
    ).toBe(0)
  })
})
