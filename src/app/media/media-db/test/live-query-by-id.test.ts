import { describe, expect, it } from 'bun:test'
import { clone } from '~/@/clone'
import { Ok, unwrap } from '~/@/result'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { MediaDbQueryOutput } from '../interface/query-output'
import { Fixtures } from './fixture'

describe.only('MediaDb Query By Id', () => {
  it('should work for live query', async () => {
    const SOME_MOVIE_ID = MediaId.fromTmdbId(551)
    for (const f of await Fixtures(['db-conn'])) {
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
