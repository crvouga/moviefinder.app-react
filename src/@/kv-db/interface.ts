import { Codec } from '../codec'
import { Result } from '../result'

export type IKvDb = {
  get: <T>(codec: Codec<T>, keys: string[]) => Promise<Result<T[], Error>>
  set: <T>(codec: Codec<T>, ...entries: [string, T][]) => Promise<Result<null, Error>>
  zap: (keys: string[]) => Promise<Result<null, Error>>
}
