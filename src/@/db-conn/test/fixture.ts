import { Logger } from '~/@/logger'
import { createPgliteTestEnv } from '~/@/pglite/pglite-test-env.test'
import { Config, DbConn } from '../impl'

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
    pglite: createPgliteTestEnv(),
    logger: Logger({ t: 'noop' }),
  })

  return configs.map(Fixture)
}

export const DbConnFixture = async () => {
  const pglite = createPgliteTestEnv()
  const dbConn = DbConn({ t: 'pglite', pglite, logger: Logger({ t: 'noop' }) })

  return { dbConn }
}
