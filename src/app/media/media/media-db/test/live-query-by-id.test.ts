import { describe, expect, it } from 'bun:test'
import { clone } from '~/@/clone'
import { unwrap } from '~/@/result'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { IMediaDb } from '../interface/interface'
import { Fixtures } from './fixture'
import { Db } from '~/@/db/interface'

describe('MediaDb Query By Id', () => {
  it.only('should work for live query', async () => {
    const SOME_MOVIE_ID = MediaId.fromTmdbId(551)
    for (const f of await Fixtures(['sql-db'])) {
      const expected = await Media.random({ id: SOME_MOVIE_ID })

      for (let i = 0; i < 10; i++) {
        unwrap(await f.mediaDb.upsert({ entities: [await Media.random()] }))
      }

      const results: Db.InferQueryOutput<typeof IMediaDb.parser>[] = []

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

      unwrap(await f.mediaDb.upsert({ entities: [expected] }))

      await new Promise((resolve) => setTimeout(resolve, 10))
      const after = clone(results)

      const peak = (results: Db.InferQueryOutput<typeof IMediaDb.parser>[]) =>
        results.map((x) => unwrap(x).entities.items)

      expect(peak(before)).toEqual([[]])
      expect(peak(after)).toEqual([[], [expected]])
    }
  })
})
