import { describe, expect, it } from 'bun:test'
import { unwrap } from '~/@/result'
import { MediaId } from '../../media-id'
import { ReadOnlyFixtures } from './fixture'

const FIGHT_CLUB_ID = MediaId.fromTmdbId(550)

describe.only('MediaDb Query By Id', () => {
  it('should work', async () => {
    for (const f of await ReadOnlyFixtures()) {
      const got = await f.mediaDb.query({
        where: { op: '=', column: 'id', value: FIGHT_CLUB_ID },
        limit: 1,
        offset: 0,
      })

      const item = unwrap(got).media.items[0]
      expect(item?.id).toEqual(FIGHT_CLUB_ID)
    }
  })
})
