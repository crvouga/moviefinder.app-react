import { Logger } from '~/@/logger'
import { Config, SqlDb } from '../impl'
import { PgliteInstance } from '~/@/pglite/pglite-instance'

const Fixture = (config: Config) => {
  const sqlDb = SqlDb(config)
  return {
    sqlDb,
  }
}

const pglite = PgliteInstance({ t: 'in-memory' })

export const Fixtures = async () => {
  const configs: Config[] = []

  configs.push({
    t: 'pglite',
    pglite,
    logger: Logger({ t: 'noop' }),
  })

  return configs.map(Fixture)
}

export const SqlDbFixture = async () => {
  const sqlDb = SqlDb({
    t: 'pglite',
    pglite,
    logger: Logger({ t: 'noop' }),
  })

  return { sqlDb }
}
