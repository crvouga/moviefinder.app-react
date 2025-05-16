import { Codec } from '../codec'
import { Result } from '../result'

export type IKvDb = {
  get: <T>(codec: Codec<T>, key: string) => Promise<Result<T | null, Error>>
  set: <T>(codec: Codec<T>, key: string, value: T) => Promise<Result<null, Error>>
  zap: (key: string) => Promise<Result<null, Error>>
}
