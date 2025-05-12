import { describe, expect, it } from 'bun:test'
import { DbConnFixture } from '~/@/db-conn/test/fixture'
import { Logger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { unwrap } from '~/@/result'
import { PubSub } from '~/@/pub-sub'
import { TmdbClientFixture } from '~/@/tmdb-client/@/fixture'
import { MediaDbBackend } from '../impl/backend'
import { OneWaySyncRemoteToLocalMsg } from './impl-one-way-sync-remote-to-local'
import { MediaDbQueryInput } from '../interface/query-input'
import { intersectionWith } from '~/@/intersection-with'

const Fixture = async () => {
  const { dbConn } = await DbConnFixture()
  const { tmdbClient } = await TmdbClientFixture()
  const local = MediaDbBackend({
    t: 'db-conn',
    dbConn,
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

    const queryInput: MediaDbQueryInput = {
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
      intersectionWith(before.media.items, expected.media.items, (a, b) => a.id === b.id).length
    ).toBe(0)

    expect(
      intersectionWith(after.media.items, expected.media.items, (a, b) => a.id === b.id).length
    ).toBeGreaterThan(0)
  })
})
