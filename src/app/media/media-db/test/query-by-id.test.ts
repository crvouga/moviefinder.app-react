import { describe, expect, it } from 'bun:test'
import { unwrap } from '~/@/result'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { Fixtures } from './fixture'

const FIGHT_CLUB_ID = MediaId.fromTmdbId(550)

describe.only('MediaDb Query By Id', () => {
  it('should work', async () => {
    for (const f of await Fixtures()) {
      const expected = Media.random({
        id: FIGHT_CLUB_ID,
      })

      for (let i = 0; i < 10; i++) {
        unwrap(await f.mediaDb.upsert({ media: [Media.random()] }))
      }

      const before = await f.mediaDb.query({
        where: { op: '=', column: 'id', value: FIGHT_CLUB_ID },
        limit: 1,
        offset: 0,
      })

      unwrap(await f.mediaDb.upsert({ media: [expected] }))

      const after = await f.mediaDb.query({
        where: { op: '=', column: 'id', value: FIGHT_CLUB_ID },
        limit: 1,
        offset: 0,
      })

      expect(unwrap(before).media.items).toEqual([])
      expect(unwrap(after).media.items).toEqual([expected])
    }
  })
})
