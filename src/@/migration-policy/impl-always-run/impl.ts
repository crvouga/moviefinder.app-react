import { z } from 'zod'
import { ILogger, Logger } from '~/@/logger'
import { IMigrationPolicy } from '../interface'

export type Config = {
  t: 'always-run'
  logger: ILogger
}

export const MigrationPolicy = (config: Config): IMigrationPolicy => {
  const logger = Logger.prefix('always-run', config.logger)
  return {
    async run(input) {
      logger.info('running migration policy', { input })
      await input.dbConn.query({
        sql: input.up,
        params: [],
        parser: z.unknown(),
      })
      logger.info('migration policy complete', { input })
    },
  }
}
