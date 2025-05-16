import { z } from 'zod'
import { Paginated } from '../../../pagination/paginated'
import { Result } from '~/@/result'
import { DbErr } from '~/@/db/interface/error'

const parser = <T, U>(entity: z.ZodType<T>, related: z.ZodType<U>) => {
  return Result.parser(
    z.object({
      entities: Paginated.parser(entity),
      related: related,
    }),
    DbErr.parser
  )
}

export type QueryOutput<T, U> = z.infer<ReturnType<typeof parser<T, U>>>

export const QueryOutput = {
  parser,
}
