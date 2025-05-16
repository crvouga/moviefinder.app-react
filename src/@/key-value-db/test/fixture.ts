import { SqlDbFixture } from '~/@/sql-db/test/fixture'
import { Logger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { Config, KeyValueDb } from '../impl'

const Fixture = (config: Config) => {
  const keyValueDb = KeyValueDb(config)
  return {
    keyValueDb,
  }
}

export const Fixtures = async () => {
  const configs: Config[] = []

  const { sqlDb } = await SqlDbFixture()

  configs.push({
    t: 'db-conn',
    sqlDb,
    migrationPolicy: MigrationPolicy({ t: 'always-run', logger: Logger({ t: 'noop' }) }),
  })

  return configs.map(Fixture)
}

export const KeyValueDbFixture = async () => {
  const { sqlDb } = await SqlDbFixture()
  return Fixture({
    t: 'db-conn',
    sqlDb,
    migrationPolicy: MigrationPolicy({ t: 'always-run', logger: Logger({ t: 'noop' }) }),
  })
}
