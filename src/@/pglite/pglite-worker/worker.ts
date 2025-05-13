import { worker } from '@electric-sql/pglite/worker'
import { createPglite } from '../create-pglite'
import { PgliteConfig } from '../types'

worker({
  async init(options) {
    const config: PgliteConfig = options.meta

    const pglite = await createPglite(config)

    return pglite
  },
})
