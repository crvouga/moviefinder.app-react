import { live, LiveNamespace } from '@electric-sql/pglite/live'
import { PGliteWorker } from '@electric-sql/pglite/worker'
import { PgliteConfig } from '../types'

export const createPgliteWorker = async (
  config: PgliteConfig
): Promise<
  PGliteWorker & {
    live: LiveNamespace
  }
> => {
  const pgliteWorker = new PGliteWorker(
    new Worker(new URL('./pglite-worker-indexed-db.js', import.meta.url), {
      type: 'module',
    }),
    {
      meta: config,
      extensions: {
        live,
      },
    }
  )

  //   @ts-ignore
  return pgliteWorker
}
