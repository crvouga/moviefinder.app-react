import { describe, expect, it } from 'bun:test'
import { unwrap } from '~/@/result'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { Fixtures } from './fixture'

describe('MediaDb Query By Id', () => {
  it('should work', async () => {
    const FIGHT_CLUB_ID = MediaId.fromTmdbId(550)

    for (const f of await Fixtures(['sql-db'])) {
      const expected = await Media.random({
        id: FIGHT_CLUB_ID,
      })

      for (let i = 0; i < 10; i++) {
        unwrap(await f.mediaDb.upsert({ entities: [await Media.random()] }))
      }

      const before = await f.mediaDb.query({
        where: { op: '=', column: 'id', value: FIGHT_CLUB_ID },
        limit: 1,
        offset: 0,
      })

      unwrap(await f.mediaDb.upsert({ entities: [expected] }))

      const after = await f.mediaDb.query({
        where: { op: '=', column: 'id', value: FIGHT_CLUB_ID },
        limit: 1,
        offset: 0,
      })

      expect(unwrap(before).entities.items).toEqual([])
      expect(unwrap(after).entities.items[0]?.id).toEqual(FIGHT_CLUB_ID)
    }
  })
})
