import { z } from 'zod'

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

export const unwrapOr = <T, E>(result: Result<T, E>, f: (e: E) => T): T => {
  if (isOk(result)) return result.value
  return f(result.error)
}

export const mapErr = <T, E, F>(result: Result<T, E>, f: (e: E) => F): Result<T, F> => {
  if (isOk(result)) return result
  return Err(f(result.error))
}

const parser = <T, E>(t: z.ZodType<T>, e: z.ZodType<E>): z.ZodSchema<Result<T, E>> => {
  return z.union([
    z.object({ t: z.literal('ok'), value: t }).strict(),
    z.object({ t: z.literal('error'), error: e }).strict(),
  ]) as z.ZodType<Result<T, E>>
}

export const Result = {
  parser,
  mapErr,
}

export type Loading = {
  t: 'loading'
}

export const Loading: Loading = {
  t: 'loading',
}

export type NotAsked = {
  t: 'not-asked'
}

export const NotAsked: NotAsked = {
  t: 'not-asked',
}

export type Remote = Loading | NotAsked

export type RemoteResult<TOk, TErr> = Remote | Ok<TOk> | Err<TErr>
