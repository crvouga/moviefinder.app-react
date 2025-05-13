import { describe, expect, it } from 'bun:test'
import { isOk } from '~/@/result'
import { TmdbClientFixture } from '../@/fixture'
import { SHOULD_TEST } from '../@/should-test'
import { MovieDetailsClient } from './details'

const Fixture = () => {
  const f = TmdbClientFixture()
  return { ...f }
}

describe.if(SHOULD_TEST)('Tmdb Movie Details', () => {
  it('should work', async () => {
    const f = Fixture()

    const FIGHT_CLUB_ID = 550
    const result = await f.tmdbClient.movie.details.get({
      pathParams: {
        id: FIGHT_CLUB_ID,
      },
      queryParams: {
        append_to_response: MovieDetailsClient.APPEND_TO_RESPONSE_ALL,
      },
    })
    expect(isOk(result)).toBe(true)
  })
})
