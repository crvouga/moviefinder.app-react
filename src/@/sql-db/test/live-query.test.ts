import { describe, expect, it } from 'bun:test'
import { z } from 'zod'
import { Ok, Result, unwrap } from '~/@/result'
import { Fixtures } from './fixture'
import { clone } from '~/@/clone'

const Row = z.object({
  id: z.string(),
  name: z.string(),
})

type Row = z.infer<typeof Row>

describe('SqlDb Live Query', () => {
  it('should be able to select and insert', async () => {
    for (const f of await Fixtures()) {
      unwrap(
        await f.sqlDb.query({
          sql: 'CREATE TABLE IF NOT EXISTS test_live_query (id TEXT PRIMARY KEY, name TEXT)',
          params: [],
          parser: z.unknown(),
        })
      )

      const liveQuery = f.sqlDb.liveQuery({
        sql: 'SELECT id, name FROM test_live_query',
        params: [],
        parser: Row,
      })

      const wait = () => new Promise((resolve) => setTimeout(resolve, 0))

      const results: Result<{ rows: Row[] }, Error>[] = []

      liveQuery.subscribe((result) => {
        results.push(result)
      })

      await wait()

      const beforeInsert = clone(results)

      const key1 = crypto.randomUUID()
      unwrap(
        await f.sqlDb.query({
          sql: 'INSERT INTO test_live_query (id, name) VALUES ($1, $2)',
          params: [key1, 'test'],
          parser: z.unknown(),
        })
      )

      await wait()

      const afterInsert = clone(results)

      const key2 = crypto.randomUUID()
      unwrap(
        await f.sqlDb.query({
          sql: 'INSERT INTO test_live_query (id, name) VALUES ($1, $2)',
          params: [key2, 'test2'],
          parser: z.unknown(),
        })
      )

      await wait()

      const afterInsert2 = clone(results)

      expect(beforeInsert).toEqual([Ok({ rows: [] })])
      expect(afterInsert).toEqual([Ok({ rows: [] }), Ok({ rows: [{ id: key1, name: 'test' }] })])
      expect(afterInsert2).toEqual([
        Ok({ rows: [] }),
        Ok({ rows: [{ id: key1, name: 'test' }] }),
        Ok({
          rows: [
            { id: key1, name: 'test' },
            { id: key2, name: 'test2' },
          ],
        }),
      ])
    }
  })
})
