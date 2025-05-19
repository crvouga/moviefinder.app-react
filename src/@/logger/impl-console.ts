import type { ILogger, LogLevel } from './interface'

export type Config = {
  t: 'console'
  prefix: string[]
}

const colors: { [level in LogLevel]: string } = {
  info: '\x1b[1m\x1b[32m', // bold green
  warn: '\x1b[1m\x1b[33m', // bold yellow
  error: '\x1b[1m\x1b[31m', // bold red
  debug: '\x1b[1m\x1b[36m', // bold cyan
  trace: '\x1b[1m\x1b[35m', // bold magenta
  fatal: '\x1b[1m\x1b[41m\x1b[37m', // bold red background, white text
}
const RESET = '\x1b[0m'

const toPrefix = (config: Config, logLevel: LogLevel): string => {
  return `${colors[logLevel]}[${logLevel}] [${config.prefix.join('] [')}]${RESET}`
}

export const Logger = (config: Config): ILogger => {
  return {
    info(...args) {
      console.log(toPrefix(config, 'info'), ...args)
    },
    warn(...args) {
      console.warn(toPrefix(config, 'warn'), ...args)
    },
    error(...args) {
      console.error(toPrefix(config, 'error'), ...args)
    },
    debug(...args) {
      console.debug(toPrefix(config, 'debug'), ...args)
    },
    trace(...args) {
      console.trace(toPrefix(config, 'trace'), ...args)
    },
    fatal(...args) {
      console.error(toPrefix(config, 'fatal'), ...args)
    },
    prefix(prefix: string[]) {
      return Logger({ ...config, prefix: [...config.prefix, ...prefix] })
    },
  }
}
