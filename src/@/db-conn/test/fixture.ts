import { createPglite } from '~/@/pglite/pglite'
import { Config, DbConn } from '../impl'
import { Logger } from '~/@/logger'

const Fixture = (config: Config) => {
  const dbConn = DbConn(config)
  return {
    dbConn,
  }
}

export const Fixtures = async () => {
  const configs: Config[] = []

  configs.push({
    t: 'pglite',
    pglite: createPglite({ t: 'in-memory' }),
    logger: Logger({ t: 'console' }),
  })

  return configs.map(Fixture)
}

export const DbConnFixture = async () => {
  const pglite = createPglite({ t: 'in-memory' })
  const dbConn = DbConn({ t: 'pglite', pglite, logger: Logger({ t: 'console' }) })

  return { dbConn }
}
