import { describe, it } from 'bun:test'
import { z } from 'zod'
import { unwrap } from '~/@/result'
import { Fixtures } from './fixture'

describe('query', () => {
  it('should be able to query', async () => {
    for (const f of Fixtures()) {
      unwrap(
        await f.dbConn.query({
          sql: 'CREATE TABLE IF NOT EXISTS test (id TEXT PRIMARY KEY, name TEXT)',
          params: [],
          parser: z.unknown(),
        })
      )
    }
  })
})
