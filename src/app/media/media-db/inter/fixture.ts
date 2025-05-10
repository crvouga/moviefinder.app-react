import { TmdbClientFixture } from '~/app/@/tmdb-client/@/fixture'
import { MediaDb } from '../impl-tmdb-client/impl-tmdb-client'

export const Fixture = async () => {
  const { tmdbClient } = TmdbClientFixture()
  const mediaDb = MediaDb({
    t: 'tmdb-client',
    tmdbClient,
  })

  return { mediaDb }
}
