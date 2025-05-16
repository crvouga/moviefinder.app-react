import { describe, expect, it } from 'bun:test'
import { z } from 'zod'
import { unwrap } from '~/@/result'
import { Fixtures } from './fixture'

describe('SqlDb Crud', () => {
  it('should be able to select and insert', async () => {
    for (const f of await Fixtures()) {
      unwrap(
        await f.sqlDb.query({
          sql: 'CREATE TABLE IF NOT EXISTS test_crud (id TEXT PRIMARY KEY, name TEXT)',
          params: [],
          parser: z.unknown(),
        })
      )

      const key = crypto.randomUUID()

      const before = unwrap(
        await f.sqlDb.query({
          sql: 'SELECT id, name FROM test_crud',
          params: [],
          parser: z.unknown(),
        })
      )

      unwrap(
        await f.sqlDb.query({
          sql: 'INSERT INTO test_crud (id, name) VALUES ($1, $2)',
          params: [key, 'test'],
          parser: z.unknown(),
        })
      )

      const after = unwrap(
        await f.sqlDb.query({
          sql: 'SELECT id, name FROM test_crud',
          params: [],
          parser: z.object({
            id: z.string(),
            name: z.string(),
          }),
        })
      )

      expect(before).toEqual({ rows: [] })
      expect(after).toEqual({ rows: [{ id: key, name: 'test' }] })
    }
  })
})
