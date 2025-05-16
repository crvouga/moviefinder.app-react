import { describe, expect, it } from 'bun:test'
import { unwrap } from '~/@/result'
import { TMDB_IDS } from '~/@/tmdb-client/@/ids'
import { MediaId } from '../../media-id'
import { Fixtures } from './fixture'

describe.only('MediaDb Query Related Data', () => {
  it('should output related data', async () => {
    for (const f of await Fixtures(['tmdb-client'])) {
      const result = unwrap(
        await f.mediaDb.query({
          limit: 1,
          offset: 0,
          where: { op: '=', column: 'id', value: MediaId.fromTmdbId(TMDB_IDS.FIGHT_CLUB) },
        })
      )

      expect(result.person.length).toBeGreaterThan(0)
    }
  })
})
