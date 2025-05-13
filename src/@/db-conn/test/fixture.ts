import { Logger } from '~/@/logger'
import { Config, DbConn } from '../impl'
import { createPglite } from '~/@/pglite/create-pglite'

const Fixture = (config: Config) => {
  const dbConn = DbConn(config)
  return {
    dbConn,
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

export const DbConnFixture = async () => {
  const dbConn = DbConn({
    t: 'pglite',
    pglite,
    logger: Logger({ t: 'noop' }),
  })

  return { dbConn }
}
