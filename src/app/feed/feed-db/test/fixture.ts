import { DbConnFixture } from '~/@/db-conn/test/fixture'
import { Logger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { FeedDb } from '../impl'

export const Fixture = async () => {
  const logger = Logger({ t: 'noop' })
  const { dbConn } = await DbConnFixture()
  const feedDb = FeedDb({
    t: 'db-conn',
    dbConn,
    logger,
    migrationPolicy: MigrationPolicy({ t: 'always-run', logger }),
  })
  return { feedDb }
}
