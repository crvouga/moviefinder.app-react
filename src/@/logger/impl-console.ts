import type { ILogger } from './interface'

export const LoggerConsole = (): ILogger => {
  return {
    info(...args) {
      console.log(`[inf]`, ...args)
    },
    warn(...args) {
      console.warn(`[wrn]`, ...args)
    },
    error(...args) {
      console.error(`[err]`, ...args)
    },
    debug(...args) {
      console.debug(`[dbg]`, ...args)
    },
    trace(...args) {
      console.trace(`[trc]`, ...args)
    },
    fatal(...args) {
      console.error(`[ftl]`, ...args)
    },
  }
}
