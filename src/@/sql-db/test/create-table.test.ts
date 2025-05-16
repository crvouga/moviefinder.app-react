import { describe, it } from 'bun:test'
import { z } from 'zod'
import { unwrap } from '~/@/result'
import { Fixtures } from './fixture'

describe('SqlDb Create Table', () => {
  it('should be able to create a table', async () => {
    for (const f of await Fixtures()) {
      unwrap(
        await f.sqlDb.query({
          sql: 'CREATE TABLE IF NOT EXISTS test (id TEXT PRIMARY KEY, name TEXT)',
          params: [],
          parser: z.unknown(),
        })
      )
    }
  })
})
