import type { PGlite } from '@electric-sql/pglite'
import type { LiveNamespace } from '@electric-sql/pglite/live'

export type PgliteConfig =
  | {
      t: 'in-memory'
    }
  | {
      t: 'indexed-db'
      databaseName: string
    }

export type PgliteInstance = PGlite & {
  live: LiveNamespace
}
