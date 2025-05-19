export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'trace' | 'fatal'

export const LOG_LEVEL_ORDER: LogLevel[] = ['fatal', 'error', 'warn', 'info', 'debug', 'trace']

export const logLevelToPrefix: { [level in LogLevel]: string } = {
  info: 'inf',
  warn: 'wrn',
  error: 'err',
  debug: 'dbg',
  trace: 'trc',
  fatal: 'fat',
}

export type ILogger = {
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
  trace: (...args: unknown[]) => void
  fatal: (...args: unknown[]) => void
  prefix: (prefix: string[]) => ILogger
  setMaxLevel: {
    [key in LogLevel]: () => void
  }
}
