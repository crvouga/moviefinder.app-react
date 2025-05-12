import { Codec } from '../codec'
import { Result } from '../result'

export type Cache = {
  get: <T>(input: {
    codec: Codec<T>
    key: string
    // maxAge: TimeSpan
    strategy: 'stale-while-revalidate' | 'always-fresh'
  }) => Promise<
    Result<
      {
        value: T
        // maxAge: TimeSpan
        insertedAt: Date
      },
      Error
    >
  >
  set: <T>(input: { codec: Codec<T>; key: string; value: T }) => Promise<void>
}
