import { z } from 'zod'
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
}
