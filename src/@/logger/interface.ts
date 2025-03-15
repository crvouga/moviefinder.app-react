export type ILogger = {
  info: (msg: unknown) => void
  warn: (msg: unknown) => void
  error: (msg: unknown) => void
  debug: (msg: unknown) => void
  noop: (msg: unknown) => void
  trace: (msg: unknown) => void
  fatal: (msg: unknown) => void
}
