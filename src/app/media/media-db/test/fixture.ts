import { DbConnFixture } from '~/@/sql-db/test/fixture'
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

export const ReadOnlyFixtures = async () => {}

export const Fixtures = async (
  include: ('tmdb-client' | 'db-conn')[] = ['tmdb-client', 'db-conn']
) => {
  const configs: Config[] = []

  if (include.includes('tmdb-client')) {
    const { tmdbClient } = TmdbClientFixture()
    configs.push({
      t: 'tmdb-client',
      tmdbClient,
    })
  }

  if (include.includes('db-conn')) {
    const { dbConn } = await DbConnFixture()
    configs.push({
      t: 'db-conn',
      dbConn,
      migrationPolicy: MigrationPolicy({ t: 'always-run', logger: Logger({ t: 'noop' }) }),
    })
  }

  return await Promise.all(configs.map(Fixture))
}
