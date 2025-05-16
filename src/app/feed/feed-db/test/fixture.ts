import { SqlDbFixture } from '~/@/sql-db/test/fixture'
import { Logger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { FeedDb } from '../impl'

export const Fixture = async () => {
  const logger = Logger({ t: 'noop' })
  const { sqlDb } = await SqlDbFixture()
  const feedDb = FeedDb({
    t: 'db-conn',
    sqlDb,
    logger,
    migrationPolicy: MigrationPolicy({ t: 'always-run', logger }),
  })
  return { feedDb }
}
