import type { ILogger } from './interface'
import { LoggerConsole } from './impl-console'
import { loggerNoop } from './impl-noop'

export type Impl =
  | {
      type: 'console'
    }
  | {
      type: 'noop'
    }

export const Logger = (impl: Impl): ILogger => {
  switch (impl.type) {
    case 'console': {
      return LoggerConsole()
    }

    case 'noop': {
      return loggerNoop
    }
  }
}

const toPrefix = (prefix: string) => `[${prefix}]`

const prefix = (prefix: string, logger: ILogger): ILogger => {
  return {
    debug(...args) {
      logger.debug(toPrefix(prefix), ...args)
    },
    error(...args) {
      logger.error(toPrefix(prefix), ...args)
    },
    fatal(...args) {
      logger.fatal(toPrefix(prefix), ...args)
    },
    info(...args) {
      logger.info(toPrefix(prefix), ...args)
    },
    trace(...args) {
      logger.trace(toPrefix(prefix), ...args)
    },
    warn(...args) {
      logger.warn(toPrefix(prefix), ...args)
    },
  }
}

Logger.prefix = prefix
