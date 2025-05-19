import * as ImplConsole from './impl-console'
import { loggerNoop } from './impl-noop'
import type { ILogger } from './interface'

export type Config =
  | ImplConsole.Config
  | {
      t: 'noop'
    }

export const Logger = (config: Config): ILogger => {
  switch (config.t) {
    case 'console': {
      return ImplConsole.Logger(config)
    }

    case 'noop': {
      return loggerNoop
    }
  }
}
