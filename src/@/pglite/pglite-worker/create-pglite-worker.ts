import { live, LiveNamespace } from '@electric-sql/pglite/live'
import { PGliteWorker } from '@electric-sql/pglite/worker'
import { PgliteConfig } from '../types'
// @ts-ignore
import PGWorker from './worker.js?worker'

export const createPgliteWorker = async (
  config: PgliteConfig
): Promise<
  PGliteWorker & {
    live: LiveNamespace
  }
> => {
  const pglite = new PGliteWorker(
    new PGWorker({
      type: 'module',
      name: 'pglite-worker',
    }),
    {
      meta: config,
      extensions: {
        live,
      },
    }
  )

  // @ts-ignore
  return pglite
}
