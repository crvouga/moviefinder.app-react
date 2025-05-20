import { z } from 'zod'
import { DbErr } from '~/@/db/interface/error'
import { isOk, Ok, Result } from '~/@/result'
import { Paginated } from '../../../pagination/paginated'

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

const init = <T, U>(): QueryOutput<T, U> => {
  return Ok({
    entities: Paginated.empty<T>(),
    related: {} as U,
  })
}

const first = <T, U>(query: QueryOutput<T, U> | null | undefined): T | null => {
  if (!query) return null
  if (isOk(query)) return query.value.entities.items[0] ?? null
  return null
}

const related = <T, U>(query: QueryOutput<T, U> | null | undefined): U | null => {
  if (!query) return null
  if (isOk(query)) return query.value.related ?? null
  return null
}

export const QueryOutput = {
  parser,
  first,
  related,
  init,
}
