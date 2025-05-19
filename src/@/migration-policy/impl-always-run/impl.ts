import { z } from 'zod'
import { ILogger } from '~/@/logger'
import { IMigrationPolicy } from '../interface'

export type Config = {
  t: 'always-run'
  logger: ILogger
}

export const MigrationPolicy = (config: Config): IMigrationPolicy => {
  const logger = config.logger.prefix(['always-run'])
  return {
    async run(input) {
      logger.info('running migration policy', { input })
      for (const up of input.up) {
        await input.sqlDb.query({
          sql: up,
          params: [],
          parser: z.unknown(),
        })
      }
      logger.info('migration policy complete', { input })
    },
  }
}
