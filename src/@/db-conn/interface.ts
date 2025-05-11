import { z } from 'zod'
import { Result } from '../result'

export type IDbConn = {
  query: <TRow>(input: {
    parser: z.ZodType<TRow>
    sql: string
    params: string[]
    limit?: number
    offset?: number
  }) => Promise<Result<{ rows: TRow[] }, Error>>
}
