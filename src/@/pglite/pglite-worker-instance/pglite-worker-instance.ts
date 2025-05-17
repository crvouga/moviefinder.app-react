import { live } from '@electric-sql/pglite/live'
import { PGliteWorker } from '@electric-sql/pglite/worker'
import { PgliteConfig, IPgliteInstance } from '../types'
// @ts-ignore
import PGWorker from './worker.js?worker'

export const PgliteWorkerInstance = async (config: PgliteConfig): Promise<IPgliteInstance> => {
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
