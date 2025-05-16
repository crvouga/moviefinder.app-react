import { z } from 'zod'
import { Sub } from '../pub-sub'
import { Result } from '../result'
import { SqlDbParam } from './sql-db-param'

export type ISqlDb = {
  query: <TRow>(input: {
    parser: z.ZodType<TRow>
    sql: string
    params?: SqlDbParam[]
    limit?: number
    offset?: number
  }) => Promise<Result<{ rows: TRow[] }, Error>>
  liveQuery: <TRow>(input: {
    parser: z.ZodType<TRow>
    sql: string
    params?: SqlDbParam[]
    limit?: number
    offset?: number
    waitFor?: Promise<unknown>
  }) => Sub<Result<{ rows: TRow[] }, Error>>
}
