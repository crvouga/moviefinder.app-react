import { PGlite } from '@electric-sql/pglite'
import { Config, DbConn } from '../impl'

const Fixture = (config: Config) => {
  const dbConn = DbConn(config)
  return {
    dbConn,
  }
}

export const Fixtures = () => {
  const configs: Config[] = []

  configs.push({
    t: 'pglite',
    pglite: new PGlite(),
  })

  return configs.map(Fixture)
}
