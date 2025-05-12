import { z } from 'zod'
import { exhaustive } from '../exhaustive-check'

const parser = <T>(column: z.ZodType<T>) => {
  return z.discriminatedUnion('op', [
    z.object({ op: z.literal('='), column: column, value: z.string() }),
    z.object({ op: z.literal('in'), column: column, value: z.array(z.string()) }),
  ])
}

export type Where<T> = z.infer<ReturnType<typeof parser<T>>>

export const toSql = <T>(where: Where<T>, columnToSqlColumn: (column: T) => string) => {
  const sqlColumn = columnToSqlColumn(where.column as T)
  switch (where.op) {
    case 'in': {
      return `WHERE ${sqlColumn} IN (${(where.value as string[]).map((v) => `'${v}'`).join(',')})`
    }
    case '=': {
      return `WHERE ${sqlColumn} = '${where.value}'`
    }
    default: {
      throw new Error('Unreachable')
    }
  }
}

const mapColumn = <T, U>(where: Where<T>, mapFn: (column: T) => U): Where<U> => {
  switch (where.op) {
    case 'in': {
      return {
        op: 'in',
        value: where.value as string[],
        column: mapFn(where.column as T),
      } as Where<U>
    }
    case '=': {
      return {
        op: '=',
        value: where.value as string,
        column: mapFn(where.column as T),
      } as Where<U>
    }
    default: {
      exhaustive(where as never)
      throw new Error('Unreachable')
    }
  }
}

export const Where = {
  parser,
  toSql,
  mapColumn,
}
