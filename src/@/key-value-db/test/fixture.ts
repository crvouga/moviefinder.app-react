import { DbConnFixture } from '~/@/db-conn/test/fixture'
import { Config, KeyValueDb } from '../impl'

const Fixture = (config: Config) => {
  const keyValueDb = KeyValueDb(config)
  return {
    keyValueDb,
  }
}

export const Fixtures = async () => {
  const configs: Config[] = []

  const { dbConn } = await DbConnFixture()

  configs.push({
    t: 'db-conn',
    dbConn,
    shouldMigrateUp: true,
  })

  return configs.map(Fixture)
}
