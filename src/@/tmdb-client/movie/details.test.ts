import { describe, expect, it } from 'bun:test'
import { isOk } from '~/@/result'
import { TmdbClientFixture } from '../@/fixture'
import { SHOULD_TEST } from '../@/should-test'
import { MovieDetailsClient } from './details'
import { TMDB_IDS } from '../@/ids'

const Fixture = () => {
  const f = TmdbClientFixture()
  return { ...f }
}

describe.if(SHOULD_TEST || true)('Tmdb Movie Details', () => {
  it.only('should work', async () => {
    const f = Fixture()

    const result = await f.tmdbClient.movie.details.get({
      pathParams: {
        id: TMDB_IDS.LORD_OF_THE_RINGS_RETURN_OF_THE_KING_ID,
      },
      queryParams: {
        append_to_response: MovieDetailsClient.APPEND_TO_RESPONSE_ALL,
      },
    })
    expect(isOk(result)).toBe(true)
  })
})
