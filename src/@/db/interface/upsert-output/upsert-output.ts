import { z } from 'zod'
import { Result } from '~/@/result'
import { DbErr } from '../error'

export const parser = <TEntity>(entity: z.ZodType<TEntity>) => {
  return Result.parser(
    z.object({
      entities: z.array(entity),
    }),
    DbErr.parser,
  )
}

export type UpsertOutput<TEntity> = z.infer<ReturnType<typeof parser<TEntity>>>

export const UpsertOutput = {
  parser,
}
