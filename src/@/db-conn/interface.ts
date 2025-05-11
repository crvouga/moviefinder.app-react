import { z } from 'zod'
import { Sub } from '../pub-sub'
import { Result } from '../result'

type Param = string | number | boolean | null | undefined | Param[]

export type IDbConn = {
  query: <TRow>(input: {
    parser: z.ZodType<TRow>
    sql: string
    params?: Param[]
    limit?: number
    offset?: number
  }) => Promise<Result<{ rows: TRow[] }, Error>>
  liveQuery: <TRow>(input: {
    parser: z.ZodType<TRow>
    sql: string
    params?: Param[]
  }) => Sub<Result<TRow, Error>>
}
