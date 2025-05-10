export type Ok<T> = { t: 'ok'; value: T }

export type Err<E> = { t: 'error'; error: E }

export type Result<T, E> = Ok<T> | Err<E>

export const Ok = <T>(value: T): Ok<T> => ({ t: 'ok', value })

export const Err = <E>(error: E): Err<E> => ({ t: 'error', error })

export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> => result.t === 'ok'

export const isErr = <T, E>(result: Result<T, E>): result is Err<E> => result.t === 'error'

export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (isOk(result)) return result.value
  throw result.error
}
