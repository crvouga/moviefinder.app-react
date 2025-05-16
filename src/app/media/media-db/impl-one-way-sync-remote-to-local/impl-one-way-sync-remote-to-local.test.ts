import { describe, expect, it } from 'bun:test'
import { Db } from '~/@/db/interface'
import { intersectionWith } from '~/@/intersection-with'
import { Logger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { PubSub } from '~/@/pub-sub'
import { unwrap } from '~/@/result'
import { SqlDbFixture } from '~/@/sql-db/test/fixture'
import { TimeSpan } from '~/@/time-span'
import { TmdbClientFixture } from '~/@/tmdb-client/@/fixture'
import { MediaDbBackend } from '../impl/backend'
import { IMediaDb } from '../interface/interface'
import { OneWaySyncRemoteToLocalMsg } from './impl-one-way-sync-remote-to-local'

const Fixture = async () => {
  const { sqlDb } = await SqlDbFixture()
  const { tmdbClient } = await TmdbClientFixture()
  const local = MediaDbBackend({
    t: 'db-conn',
    sqlDb,
    migrationPolicy: MigrationPolicy({ t: 'always-run', logger: Logger({ t: 'noop' }) }),
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
    logger: Logger({ t: 'noop' }),
    pubSub,
    throttle: TimeSpan.seconds(0),
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

    const queryInput: Db.InferQueryInput<typeof IMediaDb.parser> = {
      limit: 10,
      offset: 0,
      orderBy: [{ column: 'popularity', direction: 'desc' }],
    }

    const expected = unwrap(await f.remote.query(queryInput))

    const before = unwrap(await f.local.query(queryInput))

    unwrap(await f.mediaDb.query(queryInput))

    await f.pubSub.next((msg) => msg.t === 'synced-remote-to-local')

    const after = unwrap(await f.local.query(queryInput))

    expect(
      intersectionWith(before.entities.items, expected.entities.items, (a, b) => a.id === b.id)
        .length
    ).toBe(0)

    expect(
      intersectionWith(after.entities.items, expected.entities.items, (a, b) => a.id === b.id)
        .length
    ).toBeGreaterThan(0)
  })
})
