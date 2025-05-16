import { z } from 'zod'

export const parser = <TEntity>(entity: z.ZodType<TEntity>) => {
  return z.object({
    entities: z.array(entity),
  })
}

export type UpsertInput<TEntity> = z.infer<ReturnType<typeof parser<TEntity>>>

export const UpsertInput = {
  parser,
}
