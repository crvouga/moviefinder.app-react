import { createPglite } from '~/@/pglite/pglite'
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
    pglite: await createPglite({ t: 'in-memory' }),
  })

  return configs.map(Fixture)
}

export const DbConnFixture = async () => {
  const pglite = await createPglite({ t: 'in-memory' })
  const dbConn = DbConn({ t: 'pglite', pglite })

  return { dbConn }
}
