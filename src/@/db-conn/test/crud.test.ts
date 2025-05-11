import { describe, expect, it } from 'bun:test'
import { z } from 'zod'
import { unwrap } from '~/@/result'
import { Fixtures } from './fixture'

describe('DbConn Crud', () => {
  it('should be able to select and insert', async () => {
    for (const f of await Fixtures()) {
      unwrap(
        await f.dbConn.query({
          sql: 'CREATE TABLE IF NOT EXISTS test (id TEXT PRIMARY KEY, name TEXT)',
          params: [],
          parser: z.unknown(),
        })
      )

      const before = unwrap(
        await f.dbConn.query({
          sql: 'SELECT id, name FROM test',
          params: [],
          parser: z.unknown(),
        })
      )

      unwrap(
        await f.dbConn.query({
          sql: 'INSERT INTO test (id, name) VALUES ($1, $2)',
          params: ['1', 'test'],
          parser: z.unknown(),
        })
      )

      const after = unwrap(
        await f.dbConn.query({
          sql: 'SELECT id, name FROM test',
          params: [],
          parser: z.object({
            id: z.string(),
            name: z.string(),
          }),
        })
      )

      expect(before).toEqual({ rows: [] })
      expect(after).toEqual({ rows: [{ id: '1', name: 'test' }] })
    }
  })
})
