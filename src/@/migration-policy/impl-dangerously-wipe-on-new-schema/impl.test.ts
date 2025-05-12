import { describe, expect, it } from 'bun:test'
import { z } from 'zod'
import { DbConnFixture } from '~/@/db-conn/test/fixture'
import { KeyValueDbFixture } from '~/@/key-value-db/test/fixture'
import { Logger } from '~/@/logger'
import { MigrationPolicy } from './impl'

const Fixture = async () => {
  const { dbConn } = await DbConnFixture()
  const { keyValueDb } = await KeyValueDbFixture()
  const migrationPolicy = MigrationPolicy({
    t: 'dangerously-wipe-on-new-schema',
    keyValueDb,
    logger: Logger({ t: 'console' }),
  })
  return {
    dbConn,
    keyValueDb,
    migrationPolicy,
  }
}

describe('MigrationPolicy DangerouslyWipeOnNewSchema', () => {
  it('should run up migration when no previous schema exists', async () => {
    const f = await Fixture()
    const up = 'CREATE TABLE test (id TEXT)'
    const down = 'DROP TABLE test'
    const key = 'test-schema'

    await f.migrationPolicy.run({
      dbConn: f.dbConn,
      up,
      down,
      key,
    })

    const result = await f.dbConn.query({
      sql: 'SELECT * FROM test',
      params: [],
      parser: z.unknown(),
    })

    expect(result).toBeDefined()
  })

  it('should skip migration when schema has not changed', async () => {
    const f = await Fixture()
    const up = 'CREATE TABLE test (id TEXT)'
    const down = 'DROP TABLE test'
    const key = 'test-schema'

    // First run
    await f.migrationPolicy.run({
      dbConn: f.dbConn,
      up,
      down,
      key,
    })

    // Second run with same schema
    await f.migrationPolicy.run({
      dbConn: f.dbConn,
      up,
      down,
      key,
    })

    // Verify table still exists
    const result = await f.dbConn.query({
      sql: 'SELECT * FROM test',
      params: [],
      parser: z.unknown(),
    })

    expect(result).toBeDefined()
  })

  it('should run down and up migrations when schema has changed', async () => {
    const f = await Fixture()
    const initialUp = 'CREATE TABLE test (id TEXT)'
    const initialDown = 'DROP TABLE test'
    const key = 'test-schema'

    // First run
    await f.migrationPolicy.run({
      dbConn: f.dbConn,
      up: initialUp,
      down: initialDown,
      key,
    })

    // Second run with modified schema
    const modifiedUp = 'CREATE TABLE test (id TEXT, name TEXT)'
    const modifiedDown = 'DROP TABLE test'

    await f.migrationPolicy.run({
      dbConn: f.dbConn,
      up: modifiedUp,
      down: modifiedDown,
      key,
    })

    // Verify table exists with new schema
    const result = await f.dbConn.query({
      sql: 'SELECT * FROM test',
      params: [],
      parser: z.unknown(),
    })

    expect(result).toBeDefined()
  })
})
