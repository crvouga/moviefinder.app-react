import { describe, expect, it } from 'bun:test'
import { clone } from '~/@/clone'
import { unwrap } from '~/@/result'
import { Media } from '../../media'
import { MediaDbQueryOutput } from '../interface/query-output'
import { Fixtures } from './fixture'

describe('MediaDb Live Query', () => {
  it('should work', async () => {
    for (const f of await Fixtures(['db-conn'])) {
      const expected: [Media, Media, Media] = [
        await Media.random(),
        await Media.random(),
        await Media.random(),
      ]

      const results: MediaDbQueryOutput[] = []
      f.mediaDb
        .liveQuery({
          limit: 10,
          offset: 0,
          where: { op: 'in', column: 'id', value: expected.map((e) => e.id) },
        })
        .subscribe((result) => {
          results.push(result)
        })

      const wait = () => {
        return new Promise((resolve) => setTimeout(() => resolve(null), 0))
      }

      await wait()
      const before = clone(results)

      unwrap(await f.mediaDb.upsert({ media: [expected[0]] }))

      await wait()
      const after1 = clone(results)

      unwrap(await f.mediaDb.upsert({ media: [expected[1]] }))

      await wait()
      const after2 = clone(results)

      unwrap(await f.mediaDb.upsert({ media: [expected[2]] }))

      await wait()
      const after3 = clone(results)

      const peak = (results: MediaDbQueryOutput[]) => results.map((x) => unwrap(x).media.items)

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
