import { z } from 'zod'
import { createDbFromSqlDb } from '~/@/db/impl/create-db-from-sql-db'
import { IKvDb } from '~/@/kv-db/interface'
import { ILogger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { ISqlDb } from '~/@/sql-db/interface'
import { ITodoDb } from './interface'

export type Config = {
  t: 'sql-db'
  sqlDb: ISqlDb
  logger: ILogger
  kvDb: IKvDb
}

const up = `
CREATE TABLE IF NOT EXISTS todo (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL,
    created_at_utc TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at_utc TIMESTAMP WITH TIME ZONE NULL
)
`

const down = `
DROP TABLE IF EXISTS todo
`

export const TodoDb = (config: Config): ITodoDb => {
  return createDbFromSqlDb({
    parser: ITodoDb.parser,
    sqlDb: config.sqlDb,
    migration: {
      policy: MigrationPolicy({
        t: 'dangerously-wipe-on-new-schema',
        logger: config.logger,
        kvDb: config.kvDb,
      }),
      up: [up],
      down: [down],
    },
    getRelated: async () => ({}),
    viewName: 'todo',
    primaryKey: 'id',
    rowParser: z.object({
      id: z.string(),
      title: z.string(),
      completed: z.boolean(),
      created_at_utc: z.date(),
      updated_at_utc: z.date().nullable(),
    }),
    entityKeyToSqlColumn: (key) => {
      switch (key) {
        case 'id':
          return 'id'
        case 'title':
          return 'title'
        case 'completed':
          return 'completed'
        case 'createdAt':
          return 'created_at_utc'
        case 'updatedAt':
          return 'updated_at_utc'
      }
    },
    fieldToSqlColumn: (field) => {
      switch (field) {
        case 'id':
          return 'id'
        case 'title':
          return 'title'
        case 'completed':
          return 'completed'
        case 'createdAt':
          return 'created_at_utc'
        case 'updatedAt':
          return 'updated_at_utc'
      }
    },
    rowToEntity(row) {
      return {
        id: row.id,
        title: row.title,
        completed: row.completed,
        createdAt: row.created_at_utc,
        updatedAt: row.updated_at_utc,
      }
    },
    entityToRow(entity) {
      return {
        id: entity.id,
        title: entity.title,
        completed: entity.completed,
        created_at_utc: entity.createdAt,
        updated_at_utc: entity.updatedAt,
      }
    },
  })
}
