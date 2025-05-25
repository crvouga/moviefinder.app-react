import { z } from 'zod'
import { keyOf } from '~/@/zod/key-of'
import { quoteIfPostgresKeyword } from '../postgres-keywords'

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

const filterMap = <TEntity extends Record<string, unknown>>(
  entities: Map<string, TEntity>,
  indexes: Map<string, Map<string, Set<string>>>,
  where: Where<TEntity>
): Map<string, TEntity> => {
  switch (where.op) {
    case 'in': {
      const result = new Map<string, TEntity>()
      const columnIndex = indexes.get(String(where.column))

      if (!columnIndex) {
        return result
      }

      const pksMatchingCriteria = new Set<string>()
      for (const value of where.value) {
        const pksForValue = columnIndex.get(value)
        if (pksForValue) {
          for (const pk of pksForValue) {
            pksMatchingCriteria.add(pk)
          }
        }
      }

      for (const pk of pksMatchingCriteria) {
        if (entities.has(pk)) {
          const entity = entities.get(pk)
          if (entity) {
            result.set(pk, entity)
          }
        }
      }
      return result
    }
    case '=': {
      const result = new Map<string, TEntity>()
      const columnIndex = indexes.get(String(where.column))

      if (!columnIndex) {
        return result
      }

      const pksMatchingValue = columnIndex.get(where.value)
      if (pksMatchingValue) {
        for (const pk of pksMatchingValue) {
          if (entities.has(pk)) {
            const entity = entities.get(pk)
            if (entity) {
              result.set(pk, entity)
            }
          }
        }
      }
      return result
    }
    case 'and': {
      return where.clauses.reduce((accMap, clause) => filterMap(accMap, indexes, clause), entities)
    }
  }
}

const filterArray = <TEntity extends Record<string, unknown>>(
  entities: TEntity[],
  where: Where<TEntity>
): TEntity[] => {
  switch (where.op) {
    case 'in': {
      return entities.filter((entity) => where.value.includes(String(entity[where.column])))
    }
    case '=': {
      return entities.filter((entity) => String(entity[where.column]) === where.value)
    }
    case 'and': {
      return where.clauses.reduce((acc, clause) => filterArray(acc, clause), entities)
    }
  }
}

export const toSql = <TEntity extends Record<string, unknown>>(
  where: Where<TEntity>,
  columnToSqlColumn: (column: keyof TEntity) => string | number | symbol | null
): string => {
  switch (where.op) {
    case 'in': {
      if (where.value.length === 0) return ''
      const sqlColumn = columnToSqlColumn(where.column)
      if (!sqlColumn) return ''
      return `WHERE ${quoteIfPostgresKeyword(sqlColumn)} IN (${where.value.map((v) => `'${v}'`).join(',')})`
    }
    case '=': {
      const sqlColumn = columnToSqlColumn(where.column)
      if (!sqlColumn) return ''
      return `WHERE ${quoteIfPostgresKeyword(sqlColumn)} = '${where.value}'`
    }
    case 'and': {
      if (where.clauses.length === 0) return ''
      return `WHERE ${where.clauses.map((clause) => toSql(clause, columnToSqlColumn).replace('WHERE ', '')).join(' AND ')}`
    }
  }
}

export const Where = {
  parser,
  toSql,
  filterArray,
  filterMap,
}
