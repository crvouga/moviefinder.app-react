import { SqlDbFixture } from '~/@/sql-db/test/fixture'
import { Logger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { Config, KvDb } from '../impl'

const Fixture = (config: Config) => {
  const kvDb = KvDb(config)
  return {
    kvDb,
  }
}

export const Fixtures = async () => {
  const configs: Config[] = []

  const { sqlDb } = await SqlDbFixture()

  configs.push({
    t: 'sql-db',
    sqlDb,
    migrationPolicy: MigrationPolicy({ t: 'always-run', logger: Logger({ t: 'noop' }) }),
  })

  return configs.map(Fixture)
}

export const KvDbFixture = async () => {
  const { sqlDb } = await SqlDbFixture()
  return Fixture({
    t: 'sql-db',
    sqlDb,
    migrationPolicy: MigrationPolicy({ t: 'always-run', logger: Logger({ t: 'noop' }) }),
  })
}
