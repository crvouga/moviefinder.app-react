import { describe, expect, it } from 'bun:test'
import { unwrap } from '~/@/result'
import { isAscend, isDescend } from '~/@/sort'
import { ReadOnlyFixtures } from './fixture'

describe('MediaDb Order by popularity', () => {
  it('should work ascending', async () => {
    for (const f of await ReadOnlyFixtures()) {
      const queried = unwrap(
        await f.mediaDb.query({
          limit: 10,
          offset: 0,
          orderBy: [{ column: 'popularity', direction: 'asc' }],
        })
      )
      expect(isAscend(queried.media.items, (item) => item.popularity)).toBe(true)
    }
  })

  it.skip('should work descending', async () => {
    for (const f of await ReadOnlyFixtures()) {
      const queried = unwrap(
        await f.mediaDb.query({
          limit: 10,
          offset: 0,
          orderBy: [{ column: 'popularity', direction: 'desc' }],
        })
      )

      expect(isDescend(queried.media.items, (item) => item.popularity)).toBe(true)
    }
  })
})
