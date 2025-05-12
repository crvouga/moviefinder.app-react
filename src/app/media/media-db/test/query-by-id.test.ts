import { describe, expect, it } from 'bun:test'
import { Ok, unwrap } from '~/@/result'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { Fixtures } from './fixture'
import { MediaDbQueryOutput } from '../interface/query-output'
import { clone } from '~/@/clone'

describe('MediaDb Query By Id', () => {
  it('should work', async () => {
    const FIGHT_CLUB_ID = MediaId.fromTmdbId(550)

    for (const f of await Fixtures()) {
      const expected = await Media.random({
        id: FIGHT_CLUB_ID,
      })

      for (let i = 0; i < 10; i++) {
        unwrap(await f.mediaDb.upsert({ media: [await Media.random()] }))
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

  it('should work for live query', async () => {
    const SOME_MOVIE_ID = MediaId.fromTmdbId(551)
    for (const f of await Fixtures()) {
      const expected = await Media.random({ id: SOME_MOVIE_ID })

      for (let i = 0; i < 10; i++) {
        unwrap(await f.mediaDb.upsert({ media: [await Media.random()] }))
      }

      const results: MediaDbQueryOutput[] = []

      f.mediaDb
        .liveQuery({
          where: { op: '=', column: 'id', value: SOME_MOVIE_ID },
          limit: 1,
          offset: 0,
        })
        .subscribe((result) => {
          results.push(result)
        })

      await new Promise((resolve) => setTimeout(resolve, 10))
      const before = clone(results)

      unwrap(await f.mediaDb.upsert({ media: [expected] }))

      await new Promise((resolve) => setTimeout(resolve, 10))
      const after = clone(results)

      expect(before).toEqual([
        //
        Ok({ media: { items: [], total: 0, offset: 0, limit: 1 } }),
      ])
      expect(after).toEqual([
        Ok({ media: { items: [], total: 0, offset: 0, limit: 1 } }),
        Ok({ media: { items: [expected], total: 1, offset: 0, limit: 1 } }),
      ])
    }
  })
})
