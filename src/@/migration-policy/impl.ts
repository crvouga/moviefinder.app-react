import { Logger } from '../logger'
import { ImplAlwaysRun } from './impl-always-run'
import { ImplDangerouslyWipeOnNewSchema } from './impl-dangerously-wipe-on-new-schema'
import { ImplNoop } from './impl-noop'
import { IMigrationPolicy } from './interface'

export type Config = ImplDangerouslyWipeOnNewSchema.Config | ImplNoop.Config | ImplAlwaysRun.Config

export const MigrationPolicy = (config: Config): IMigrationPolicy => {
  const logger = Logger.prefix(
    'migration-policy',
    'logger' in config ? config.logger : Logger({ type: 'console' })
  )
  switch (config.t) {
    case 'noop':
      return ImplNoop.MigrationPolicy({ ...config })
    case 'dangerously-wipe-on-new-schema':
      return ImplDangerouslyWipeOnNewSchema.MigrationPolicy({ ...config, logger })
    case 'always-run':
      return ImplAlwaysRun.MigrationPolicy({ ...config, logger })
  }
}
