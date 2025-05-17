import { SqlDbFixture } from '~/@/sql-db/test/fixture'
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
  include: ('tmdb-client' | 'sql-db')[] = ['tmdb-client', 'sql-db']
) => {
  const configs: Config[] = []

  if (include.includes('tmdb-client')) {
    const { tmdbClient } = TmdbClientFixture()
    configs.push({
      t: 'tmdb-client',
      tmdbClient,
    })
  }

  if (include.includes('sql-db')) {
    const { sqlDb } = await SqlDbFixture()
    configs.push({
      t: 'sql-db',
      sqlDb,
      migrationPolicy: MigrationPolicy({ t: 'always-run', logger: Logger({ t: 'noop' }) }),
    })
  }

  return await Promise.all(configs.map(Fixture))
}
