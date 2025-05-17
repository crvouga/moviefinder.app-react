import { worker } from '@electric-sql/pglite/worker'
import { PgliteInstance } from '../pglite-instance'
import { PgliteConfig } from '../types'

worker({
  async init(options) {
    const config: PgliteConfig = options.meta

    const pglite = await PgliteInstance(config)

    return pglite
  },
})
