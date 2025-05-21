import { Codec } from './codec'
import { IKvDb } from './kv-db/interface'
import { unwrapOr } from './result'
import { TimeSpan } from './time-span'

/**
 * Creates a throttled version of a function that throttles based on a key.
 * Each unique key maintains its own throttle state.
 *
 * @description
 * When the throttled function is called multiple times with the same key within the time span,
 * only the first call is executed. Different keys are throttled independently.
 *
 * @param timeSpan - The minimum time that must pass between function executions for each key
 * @param getKey - Function to derive the throttle key from the arguments
 * @param fn - The function to throttle
 * @returns A throttled version of the input function
 *
 * @example
 * ```ts
 * const throttledFn = throttleByKey(
 *   TimeSpan.seconds(1),
 *   (id: string) => id,
 *   (id) => console.log('Called with', id)
 * )
 * throttledFn('a') // Logs 'Called with a'
 * throttledFn('a') // Ignored (throttled)
 * throttledFn('b') // Logs 'Called with b' (different key)
 * ```
 */
export const throttleByKeyDurable = <TArgs extends any[]>(config: {
  kvDb: IKvDb
  timeSpan: TimeSpan
  getKey: (...args: TArgs) => string
  fn: (...args: TArgs) => void
}) => {
  return async (...args: TArgs) => {
    const key = config.getKey(...args)
    const now = Date.now()
    const lastCall =
      unwrapOr(await config.kvDb.get(Codec.integer, [String(key)]), () => [0])[0] ?? 0

    if (now - lastCall > TimeSpan.toMilliseconds(config.timeSpan)) {
      await config.kvDb.set(Codec.integer, [String(key), now])
      config.fn(...args)
    }
  }
}
