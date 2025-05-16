import { Logger } from '~/@/logger'
import { Config, SqlDb } from '../impl'
import { createPglite } from '~/@/pglite/create-pglite'

const Fixture = (config: Config) => {
  const sqlDb = SqlDb(config)
  return {
    sqlDb,
  }
}

const pglite = createPglite({ t: 'in-memory' })

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
