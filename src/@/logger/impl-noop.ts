import type { ILogger } from './interface'

export const loggerNoop: ILogger = {
  info() {},
  warn() {},
  error() {},
  debug() {},
  trace() {},
  fatal() {},
}
