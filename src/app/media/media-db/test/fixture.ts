import { DbConnFixture } from '~/@/db-conn/test/fixture'
import { Logger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { TmdbClientFixture } from '~/@/tmdb-client/@/fixture'
import { Config, MediaDbBackend } from '../impl/backend'

const Fixture = async (config: Config) => {
  const mediaDb = MediaDbBackend(config)

  return {
    mediaDb,
  }
}

export const ReadOnlyFixtures = async () => {
  const configs: Config[] = []

  const { tmdbClient } = TmdbClientFixture()
  configs.push({
    t: 'tmdb-client',
    tmdbClient,
  })

  const { dbConn } = await DbConnFixture()
  configs.push({
    t: 'db-conn',
    dbConn,
    migrationPolicy: MigrationPolicy({ t: 'always-run', logger: Logger({ t: 'console' }) }),
  })

  return await Promise.all(configs.map(Fixture))
}

export const Fixtures = async () => {
  const configs: Config[] = []

  const { dbConn } = await DbConnFixture()
  configs.push({
    t: 'db-conn',
    dbConn,
    migrationPolicy: MigrationPolicy({ t: 'always-run', logger: Logger({ t: 'console' }) }),
  })

  return await Promise.all(configs.map(Fixture))
}
