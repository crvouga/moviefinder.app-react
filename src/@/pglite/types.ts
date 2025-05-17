import type { PGlite } from '@electric-sql/pglite'
import type { LiveNamespace } from '@electric-sql/pglite/live'
import type { PGliteWorker } from '@electric-sql/pglite/worker'

export type PgliteConfig =
  | {
      t: 'in-memory'
    }
  | {
      t: 'indexed-db'
      databaseName: string
    }

export type IPgliteInstance = PGlite & {
  live: LiveNamespace
}

export type IPgliteWorkerInstance = PGliteWorker & {
  live: LiveNamespace
}
