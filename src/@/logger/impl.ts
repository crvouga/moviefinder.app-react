import type { ILogger } from './interface'
import { LoggerConsole } from './impl-console'
import { loggerNoop } from './impl-noop'

export type Impl =
  | {
      t: 'console'
    }
  | {
      t: 'noop'
    }

export const Logger = (impl: Impl): ILogger => {
  switch (impl.t) {
    case 'console': {
      return LoggerConsole()
    }

    case 'noop': {
      return loggerNoop
    }
  }
}

const prefix = (prefix: string, logger: ILogger): ILogger => {
  return {
    noop() {},
    debug(msg) {
      logger.debug(`[${prefix}] ${msg}`)
    },
    error(msg) {
      logger.error(`[${prefix}] ${msg}`)
    },
    fatal(msg) {
      logger.fatal(`[${prefix}] ${msg}`)
    },
    info(msg) {
      logger.info(`[${prefix}] ${msg}`)
    },
    trace(msg) {
      logger.trace(`[${prefix}] ${msg}`)
    },
    warn(msg) {
      logger.warn(`[${prefix}] ${msg}`)
    },
  }
}

Logger.prefix = prefix
