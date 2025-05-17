import { Logger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { SqlDbFixture } from '~/@/sql-db/test/fixture'
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
    migrationPolicy: MigrationPolicy({
      t: 'always-run',
      logger: Logger({ t: 'noop' }),
    }),
  })

  configs.push({
    t: 'namespaced',
    kvDb: KvDb({
      t: 'sql-db',
      sqlDb,
      migrationPolicy: MigrationPolicy({ t: 'always-run', logger: Logger({ t: 'noop' }) }),
    }),
    namespace: ['test'],
  })

  // configs.push({
  //   t: 'browser-storage',
  //   storage: localStorage,
  // })

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
