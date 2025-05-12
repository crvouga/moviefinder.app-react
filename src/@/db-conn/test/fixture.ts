import { Logger } from '~/@/logger'
import { createPgliteTestEnv } from '~/@/pglite/pglite-test-env.test'
import { Config, DbConn } from '../impl'
import { z } from 'zod'

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
    logger: Logger({ t: 'console' }),
  })

  return configs.map(Fixture)
}

const DELETE_EVERYTHING = `
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
END $$;
`

export const DbConnFixture = async () => {
  const pglite = createPgliteTestEnv()
  const dbConn = DbConn({ t: 'pglite', pglite, logger: Logger({ t: 'console' }) })

  await dbConn.query({
    sql: DELETE_EVERYTHING,
    params: [],
    parser: z.unknown(),
  })

  return { dbConn }
}
