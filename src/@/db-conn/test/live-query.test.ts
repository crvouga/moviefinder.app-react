import { describe, expect, it } from 'bun:test'
import { z } from 'zod'
import { Ok, Result, unwrap } from '~/@/result'
import { Fixtures } from './fixture'

const Row = z.object({
  id: z.string(),
  name: z.string(),
})

type Row = z.infer<typeof Row>

describe('DbConn Live Query', () => {
  it('should be able to select and insert', async () => {
    for (const f of await Fixtures()) {
      unwrap(
        await f.dbConn.query({
          sql: 'CREATE TABLE IF NOT EXISTS test (id TEXT PRIMARY KEY, name TEXT)',
          params: [],
          parser: z.unknown(),
        })
      )

      const liveQuery = f.dbConn.liveQuery({
        sql: 'SELECT id, name FROM test',
        params: [],
        parser: Row,
      })

      const wait = () => new Promise((resolve) => setTimeout(resolve, 0))

      const results: Result<{ rows: Row[] }, Error>[] = []

      liveQuery.subscribe((result) => {
        results.push(result)
      })

      await wait()

      const beforeInsert = JSON.parse(JSON.stringify(results))

      unwrap(
        await f.dbConn.query({
          sql: 'INSERT INTO test (id, name) VALUES ($1, $2)',
          params: ['1', 'test'],
          parser: z.unknown(),
        })
      )

      await wait()

      const afterInsert = JSON.parse(JSON.stringify(results))

      unwrap(
        await f.dbConn.query({
          sql: 'INSERT INTO test (id, name) VALUES ($1, $2)',
          params: ['2', 'test2'],
          parser: z.unknown(),
        })
      )

      await wait()

      const afterInsert2 = JSON.parse(JSON.stringify(results))

      expect(beforeInsert).toEqual([Ok({ rows: [] })])
      expect(afterInsert).toEqual([Ok({ rows: [] }), Ok({ rows: [{ id: '1', name: 'test' }] })])
      expect(afterInsert2).toEqual([
        Ok({ rows: [] }),
        Ok({ rows: [{ id: '1', name: 'test' }] }),
        Ok({
          rows: [
            { id: '1', name: 'test' },
            { id: '2', name: 'test2' },
          ],
        }),
      ])
    }
  })
})
