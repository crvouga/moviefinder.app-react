import type { ILogger } from './interface'

export const LoggerConsole = (): ILogger => {
  return {
    info(msg) {
      console.log(`[inf]`, msg)
    },
    warn(msg) {
      console.warn(`[wrn]`, msg)
    },
    error(msg) {
      console.error(`[err]`, msg)
    },
    debug(msg) {
      console.debug(`[dbg]`, msg)
    },
    trace(msg) {
      console.trace(`[trc]`, msg)
    },
    fatal(msg) {
      console.error(`[ftl]`, msg)
    },
    noop() {},
  }
}
