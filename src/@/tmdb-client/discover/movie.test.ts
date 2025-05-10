import { describe, expect, it } from 'bun:test'
import { isOk } from '~/@/result'
import { TmdbClientFixture } from '../@/fixture'
import { SHOULD_TEST } from '../@/should-test'

const Fixture = () => {
  const f = TmdbClientFixture()
  return { ...f }
}

describe.if(SHOULD_TEST)('Tmdb Discover Movie', () => {
  it('should work', async () => {
    const f = Fixture()

    const result = await f.tmdbClient.discover.movie.get({
      pathParams: {},
      queryParams: {},
    })

    expect(isOk(result)).toBe(true)
  })

  it('should paginate correctly', async () => {
    const f = Fixture()

    const result = await f.tmdbClient.discover.movie.get({
      pathParams: {},
      queryParams: {
        page: 1,
      },
    })

    expect(isOk(result)).toBe(true)
  })
})
