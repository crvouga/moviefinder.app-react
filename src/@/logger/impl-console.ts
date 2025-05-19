import { LOG_LEVEL_ORDER, type ILogger, type LogLevel } from './interface'

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

type State = {
  maxLogLevel: LogLevel
}

let state: State = { maxLogLevel: 'info' }

const setMaxLevel = (logLevel: LogLevel) => {
  state = { ...state, maxLogLevel: logLevel }
  console.log(`max log level is set to ${logLevel}`)
}

const shouldLog = (maxLogLevel: LogLevel, logLevel: LogLevel): boolean => {
  return LOG_LEVEL_ORDER.indexOf(maxLogLevel) >= LOG_LEVEL_ORDER.indexOf(logLevel)
}

export const Logger = (config: Config): ILogger => {
  return {
    info(...args) {
      if (shouldLog(state.maxLogLevel, 'info')) {
        console.log(toPrefix(config, 'info'), ...args)
      }
    },
    warn(...args) {
      if (shouldLog(state.maxLogLevel, 'warn')) {
        console.warn(toPrefix(config, 'warn'), ...args)
      }
    },
    error(...args) {
      if (shouldLog(state.maxLogLevel, 'error')) {
        console.error(toPrefix(config, 'error'), ...args)
      }
    },
    debug(...args) {
      if (shouldLog(state.maxLogLevel, 'debug')) {
        console.debug(toPrefix(config, 'debug'), ...args)
      }
    },
    trace(...args) {
      if (shouldLog(state.maxLogLevel, 'trace')) {
        console.trace(toPrefix(config, 'trace'), ...args)
      }
    },
    fatal(...args) {
      if (shouldLog(state.maxLogLevel, 'fatal')) {
        console.error(toPrefix(config, 'fatal'), ...args)
      }
    },
    prefix(prefix: string[]) {
      return Logger({
        ...config,
        prefix: [...config.prefix, ...prefix],
      })
    },
    setMaxLevel: {
      info: () => {
        setMaxLevel('info')
      },
      warn: () => {
        setMaxLevel('warn')
      },
      error: () => {
        setMaxLevel('error')
      },
      debug: () => {
        setMaxLevel('debug')
      },
      trace: () => {
        setMaxLevel('trace')
      },
      fatal: () => {
        setMaxLevel('fatal')
      },
    },
  }
}
