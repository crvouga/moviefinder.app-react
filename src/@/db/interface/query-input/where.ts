import { z } from 'zod'
import { quoteIfPostgresKeyword } from '../postgres-keywords'
import { keyOf } from '~/@/zod/key-of'

export type Where<T extends Record<string, unknown>> =
  | {
      op: '='
      column: keyof T
      value: string
    }
  | {
      op: 'in'
      column: keyof T
      value: string[]
    }
  | {
      op: 'and'
      clauses: Where<T>[]
    }

const parser = <TEntity extends Record<string, unknown>>(
  column: z.ZodObject<z.ZodRawShape>
): z.ZodType<Where<TEntity>> => {
  const schema = z.discriminatedUnion('op', [
    z.object({
      op: z.literal('='),
      column: keyOf(column),
      value: z.string(),
    }),
    z.object({
      op: z.literal('in'),
      column: keyOf(column),
      value: z.array(z.string()),
    }),
    z.object({
      op: z.literal('and'),
      clauses: z.unknown(),
    }),
  ])
  // @ts-ignore
  return schema
}

export const toSql = <TEntity extends Record<string, unknown>>(
  where: Where<TEntity>,
  columnToSqlColumn: (column: keyof TEntity) => string | number | symbol
): string => {
  switch (where.op) {
    case 'in': {
      if (where.value.length === 0) return ''
      return `WHERE ${quoteIfPostgresKeyword(columnToSqlColumn(where.column))} IN (${where.value.map((v) => `'${v}'`).join(',')})`
    }
    case '=': {
      return `WHERE ${quoteIfPostgresKeyword(columnToSqlColumn(where.column))} = '${where.value}'`
    }
    case 'and': {
      if (where.clauses.length === 0) return ''
      return `WHERE ${where.clauses.map((clause) => toSql(clause, columnToSqlColumn).replace('WHERE ', '')).join(' AND ')}`
    }
  }
}

const mapColumn = <TEntity extends Record<string, unknown>, U extends Record<string, unknown>>(
  where: Where<TEntity>,
  mapFn: (column: keyof TEntity) => keyof U
): Where<U> => {
  switch (where.op) {
    case 'in': {
      return {
        op: 'in',
        value: where.value,
        column: mapFn(where.column),
      }
    }
    case '=': {
      return {
        op: '=',
        value: where.value,
        column: mapFn(where.column),
      }
    }
    case 'and': {
      return {
        op: 'and',
        clauses: where.clauses.map((clause) => mapColumn(clause, mapFn)),
      }
    }
  }
}

export const Where = {
  parser,
  toSql,
  mapColumn,
}
