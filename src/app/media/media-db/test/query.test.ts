import { describe, expect, it } from 'bun:test'
import { Ok, unwrap } from '~/@/result'
import { Media } from '../../media'
import { Fixtures } from './fixture'

describe('MediaDb Query', () => {
  it('should work', async () => {
    for (const f of await Fixtures()) {
      const expected = [await Media.random(), await Media.random(), await Media.random()]
      const before = await f.mediaDb.query({ limit: 10, offset: 0 })
      const upserted = await f.mediaDb.upsert({ media: expected })
      const after = await f.mediaDb.query({ limit: 10, offset: 0 })

      expect(unwrap(before).media.items).toEqual([])
      expect(upserted).toEqual(Ok(null))
      expect(unwrap(after).media.items).toEqual(expected)
    }
  })
})
