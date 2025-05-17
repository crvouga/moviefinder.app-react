import { TimeSpan } from './time-span'

/**
 * Creates a throttled version of a function that only executes at most once within a specified time span.
 *
 * @description
 * When the throttled function is called multiple times within the time span, only the first call is executed.
 * Subsequent calls within the time span are ignored. After the time span has elapsed, the next call will execute.
 *
 * @param timeSpan - The minimum time that must pass between function executions
 * @param fn - The function to throttle
 * @returns A throttled version of the input function
 *
 * @example
 * ```ts
 * const throttledFn = throttle(TimeSpan.seconds(1), () => console.log('Called'))
 * throttledFn() // Logs 'Called'
 * throttledFn() // Ignored
 * throttledFn() // Ignored
 * // After 1 second...
 * throttledFn() // Logs 'Called'
 * ```
 */
export const throttle = <T>(timeSpan: TimeSpan, fn: (...args: T[]) => void) => {
  let lastCall = 0
  return (...args: T[]) => {
    const now = Date.now()
    if (now - lastCall > TimeSpan.toMilliseconds(timeSpan)) {
      lastCall = now
      fn(...args)
    }
  }
}
