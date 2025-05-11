import { describe, expect, it } from 'bun:test'
import { DbConnFixture } from '~/@/db-conn/test/fixture'
import { MediaDbBackend } from '../impl/backend'

const Fixture = async () => {
  const dbConnLocal = await DbConnFixture()
  const dbConnRemote = await DbConnFixture()
  const local = MediaDbBackend({
    t: 'db-conn',
    dbConn: dbConnLocal.dbConn,
    shouldCreateTable: true,
  })
  const remote = MediaDbBackend({
    t: 'db-conn',
    dbConn: dbConnRemote.dbConn,
    shouldCreateTable: true,
  })
  const mediaDb = MediaDbBackend({ t: 'sync-reads', local, remote })

  return {
    mediaDb,
    local,
    remote,
    dbConnLocal,
    dbConnRemote,
  }
}

describe('MediaDb Sync Reads', () => {
  it('should be defined', async () => {
    const { mediaDb } = await Fixture()
    expect(mediaDb).toBeDefined()
  })
})
