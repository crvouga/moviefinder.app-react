export type Ok<T> = {
  type: 'ok'
  value: T
}

export type Err<E> = {
  type: 'error'
  error: E
}

export type Result<T, E> = Ok<T> | Err<E>

export const Ok = <T>(value: T): Ok<T> => ({ type: 'ok', value })

export const Err = <E>(error: E): Err<E> => ({ type: 'error', error })

export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> => result.type === 'ok'

export const isErr = <T, E>(result: Result<T, E>): result is Err<E> => result.type === 'error'
