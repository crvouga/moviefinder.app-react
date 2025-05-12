import { describe, expect, it } from 'bun:test'
import { DbConnFixture } from '~/@/db-conn/test/fixture'
import { Logger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { unwrap } from '~/@/result'
import { PubSub } from '~/@/pub-sub'
import { TmdbClientFixture } from '~/@/tmdb-client/@/fixture'
import { MediaDbBackend } from '../impl/backend'
import { OneWaySyncRemoteToLocalMsg } from './impl-one-way-sync-remote-to-local'

const Fixture = async () => {
  const { dbConn } = await DbConnFixture()
  const { tmdbClient } = await TmdbClientFixture()
  const local = MediaDbBackend({
    t: 'db-conn',
    dbConn,
    migrationPolicy: MigrationPolicy({ t: 'always-run', logger: Logger({ t: 'console' }) }),
  })
  const remote = MediaDbBackend({
    t: 'tmdb-client',
    tmdbClient,
  })
  const pubSub = PubSub<OneWaySyncRemoteToLocalMsg>()
  const mediaDb = MediaDbBackend({
    t: 'one-way-sync-remote-to-local',
    local,
    remote,
    logger: Logger({ t: 'console' }),
    pubSub,
  })
  return {
    mediaDb,
    local,
    remote,
    pubSub,
  }
}

describe('MediaDb One Way Sync Remote To Local', () => {
  it('should sync data from remote to local', async () => {
    const f = await Fixture()

    const before = unwrap(await f.local.query({ limit: 10, offset: 0 }))

    unwrap(await f.mediaDb.query({ limit: 10, offset: 0 }))

    await f.pubSub.next((msg) => msg.t === 'synced-remote-to-local')

    const after = unwrap(await f.local.query({ limit: 10, offset: 0 }))

    expect(before.media.items.length).toBe(0)
    expect(after.media.items.length).toBeGreaterThan(0)
  })
})
