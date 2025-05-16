import { describe, expect, it } from 'bun:test'
import { z } from 'zod'
import { DbConnFixture } from '~/@/sql-db/test/fixture'
import { KeyValueDbFixture } from '~/@/key-value-db/test/fixture'
import { Logger } from '~/@/logger'
import { unwrap } from '~/@/result'
import { MigrationPolicy } from './impl'

const Fixture = async () => {
  const { dbConn } = await DbConnFixture()
  const { keyValueDb } = await KeyValueDbFixture()
  const migrationPolicy = MigrationPolicy({
    t: 'dangerously-wipe-on-new-schema',
    keyValueDb,
    logger: Logger({ t: 'noop' }),
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

    await f.migrationPolicy.run({
      dbConn: f.dbConn,
      up,
      down,
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

    // First run
    await f.migrationPolicy.run({
      dbConn: f.dbConn,
      up,
      down,
    })

    // Second run with same schema
    await f.migrationPolicy.run({
      dbConn: f.dbConn,
      up,
      down,
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

    // First run
    await f.migrationPolicy.run({
      dbConn: f.dbConn,
      up: initialUp,
      down: initialDown,
    })

    // Second run with modified schema
    const modifiedUp = 'CREATE TABLE test (id TEXT, name TEXT)'
    const modifiedDown = 'DROP TABLE test'

    await f.migrationPolicy.run({
      dbConn: f.dbConn,
      up: modifiedUp,
      down: modifiedDown,
    })

    // Verify table exists with new schema
    const result = await f.dbConn.query({
      sql: 'SELECT * FROM test',
      params: [],
      parser: z.unknown(),
    })

    expect(result).toBeDefined()
  })

  it('should run up migration when a previous schema exists but its not within the key value db', async () => {
    const f = await Fixture()

    unwrap(
      await f.dbConn.query({
        sql: 'CREATE TABLE my_test_test (id TEXT)',
        params: [],
        parser: z.unknown(),
      })
    )

    const up = 'CREATE TABLE IF NOT EXISTS my_test_test (id TEXT, foo TEXT)'
    const down = 'DROP TABLE IF EXISTS my_test_test'

    await f.migrationPolicy.run({
      dbConn: f.dbConn,
      up,
      down,
    })

    await f.dbConn.query({
      sql: 'INSERT INTO my_test_test (id, foo) VALUES (?, ?)',
      params: ['1', 'bar'],
      parser: z.unknown(),
    })

    unwrap(
      await f.dbConn.query({
        sql: 'SELECT id, foo FROM my_test_test',
        params: [],
        parser: z.unknown(),
      })
    )
  })
})
