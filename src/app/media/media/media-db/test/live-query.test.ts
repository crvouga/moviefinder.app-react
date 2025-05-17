import { describe, expect, it } from 'bun:test'
import { clone } from '~/@/clone'
import { Db } from '~/@/db/interface'
import { unwrap } from '~/@/result'
import { Media } from '../../media'
import { IMediaDb } from '../interface/interface'
import { Fixtures } from './fixture'
import { NonEmpty } from '~/@/non-empty'

describe('MediaDb Live Query', () => {
  it('should work', async () => {
    for (const f of await Fixtures(['sql-db'])) {
      const expected: [Media, Media, Media] = [
        await Media.random(),
        await Media.random(),
        await Media.random(),
      ]

      const results: Db.InferQueryOutput<typeof IMediaDb.parser>[] = []
      f.mediaDb
        .liveQuery({
          limit: 10,
          offset: 0,
          where: { op: 'in', column: 'id', value: NonEmpty.map(expected, (e) => e.id) },
        })
        .subscribe((result) => {
          results.push(result)
        })

      const wait = () => {
        return new Promise((resolve) => setTimeout(() => resolve(null), 0))
      }

      await wait()
      const before = clone(results)

      unwrap(await f.mediaDb.upsert({ entities: [expected[0]] }))

      await wait()
      const after1 = clone(results)

      unwrap(await f.mediaDb.upsert({ entities: [expected[1]] }))

      await wait()
      const after2 = clone(results)

      unwrap(await f.mediaDb.upsert({ entities: [expected[2]] }))

      await wait()
      const after3 = clone(results)

      const peak = (results: Db.InferQueryOutput<typeof IMediaDb.parser>[]) =>
        results.map((x) => unwrap(x).entities.items)

      expect(peak(before)).toEqual([[]])
      expect(peak(after1)).toEqual([[], [expected[0]]])
      expect(peak(after2)).toEqual([[], [expected[0]], [expected[0], expected[1]]])
      expect(peak(after3)).toEqual([
        [],
        [expected[0]],
        [expected[0], expected[1]],
        [expected[0], expected[1], expected[2]],
      ])
    }
  })
})
