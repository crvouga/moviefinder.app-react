import { z } from 'zod'
import { quoteIfPostgresKeyword } from '../postgres-keywords'

export type Where<T> =
  | {
      op: '='
      column: T
      value: string
    }
  | {
      op: 'in'
      column: T
      value: string[]
    }
  | {
      op: 'and'
      clauses: Where<T>[]
    }

const parser = <T>(column: z.ZodType<T>): z.ZodType<Where<T>> => {
  const schema = z.discriminatedUnion('op', [
    z.object({
      op: z.literal('='),
      column,
      value: z.string(),
    }),
    z.object({
      op: z.literal('in'),
      column,
      value: z.array(z.string()),
    }),
    z.object({
      op: z.literal('and'),
      clauses: z.any(),
    }),
  ])
  // @ts-ignore
  return schema
}

export const toSql = <T>(where: Where<T>, columnToSqlColumn: (column: T) => string): string => {
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

const mapColumn = <T, U>(where: Where<T>, mapFn: (column: T) => U): Where<U> => {
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
