import { describe, expect, it } from 'bun:test'
import { clone } from '~/@/clone'
import { Ok, unwrap } from '~/@/result'
import { Media } from '../../media'
import { MediaDbQueryOutput } from '../interface/query-output'
import { Fixtures } from './fixture'

describe('MediaDb Live Query', () => {
  it('should work', async () => {
    for (const f of await Fixtures()) {
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

      expect(before).toEqual([Ok({ media: { items: [], total: 0, offset: 0, limit: 10 } })])
      expect(after1).toEqual([
        Ok({ media: { items: [], total: 0, offset: 0, limit: 10 } }),
        Ok({ media: { items: [expected[0]], total: 1, offset: 0, limit: 10 } }),
      ])
      expect(after2).toEqual([
        Ok({ media: { items: [], total: 0, offset: 0, limit: 10 } }),
        Ok({ media: { items: [expected[0]], total: 1, offset: 0, limit: 10 } }),
        Ok({ media: { items: [expected[0], expected[1]], total: 2, offset: 0, limit: 10 } }),
      ])
      expect(after3).toEqual([
        Ok({ media: { items: [], total: 0, offset: 0, limit: 10 } }),
        Ok({ media: { items: [expected[0]], total: 1, offset: 0, limit: 10 } }),
        Ok({ media: { items: [expected[0], expected[1]], total: 2, offset: 0, limit: 10 } }),
        Ok({
          media: { items: [expected[0], expected[1], expected[2]], total: 3, offset: 0, limit: 10 },
        }),
      ])
    }
  })
})
