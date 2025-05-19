import type { ILogger } from './interface'

export const loggerNoop: ILogger = {
  info() {},
  warn() {},
  error() {},
  debug() {},
  trace() {},
  fatal() {},
  prefix() {
    return loggerNoop
  },
  setMaxLevel: {
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
    trace: () => {},
    fatal: () => {},
  },
}
