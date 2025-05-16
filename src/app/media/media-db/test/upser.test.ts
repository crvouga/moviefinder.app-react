import { describe, it } from 'bun:test'
import { unwrap } from '~/@/result'
import { Media } from '../../media'
import { Fixtures } from './fixture'

describe('MediaDb Query Upsert', () => {
  it('should work', async () => {
    for (const f of await Fixtures(['db-conn'])) {
      const expected = [await Media.random(), await Media.random(), await Media.random()]
      unwrap(await f.mediaDb.query({ limit: 10, offset: 0 }))
      unwrap(await f.mediaDb.upsert({ media: expected }))
      unwrap(await f.mediaDb.query({ limit: 10, offset: 0 }))
    }
  })
})
