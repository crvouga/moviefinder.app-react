import { describe, expect, it } from 'bun:test'
import { isOk } from '~/@/result'
import { TmdbClientFixture } from '../@/fixture'

const Fixture = () => {
  const f = TmdbClientFixture()
  return { ...f }
}

describe('Tmdb Discover Movie', () => {
  it('should work', async () => {
    const f = Fixture()

    const result = await f.tmdbClient.discover.movie.get({
      pathParams: {},
      queryParams: {},
    })

    expect(isOk(result)).toBe(true)
  })
})
