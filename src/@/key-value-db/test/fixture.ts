import { DbConnFixture } from '~/@/db-conn/test/fixture'
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

  const { dbConn } = await DbConnFixture()

  configs.push({
    t: 'db-conn',
    dbConn,
    migrationPolicy: MigrationPolicy({ t: 'always-run', logger: Logger({ type: 'console' }) }),
  })

  return configs.map(Fixture)
}

export const KeyValueDbFixture = async () => {
  const { dbConn } = await DbConnFixture()
  return Fixture({
    t: 'db-conn',
    dbConn,
    migrationPolicy: MigrationPolicy({ t: 'always-run', logger: Logger({ type: 'console' }) }),
  })
}
