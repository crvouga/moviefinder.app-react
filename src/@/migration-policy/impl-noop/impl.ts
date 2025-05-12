import { IMigrationPolicy } from '../interface'

export type Config = {
  t: 'noop'
}

export const MigrationPolicy = (_config: Config): IMigrationPolicy => {
  return {
    async run(_input) {},
  }
}
