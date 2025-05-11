import { TmdbClientFixture } from '~/@/tmdb-client/@/fixture'
import { MediaDb } from '../impl-tmdb-client/impl-tmdb-client'
import { Config } from '../impl/backend'

const Fixture = async (config: Config) => {
  const mediaDb = MediaDb(config)

  return { mediaDb }
}

export const Fixtures = async () => {
  const configs: Config[] = []

  const { tmdbClient } = TmdbClientFixture()
  configs.push({
    t: 'tmdb-client',
    tmdbClient,
  })

  return await Promise.all(configs.map(Fixture))
}
