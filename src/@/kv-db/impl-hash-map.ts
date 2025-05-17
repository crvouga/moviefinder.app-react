import { Codec } from '../codec'
import { Ok } from '../result'
import { IKvDb } from './interface'

export type Config = {
  t: 'hash-map'
  map: Map<string, string>
}

export const KvDb = (config: Config): IKvDb => {
  return {
    async get<T>(codec: Codec<T>, keys: string[]) {
      const values = keys.flatMap((key) => {
        const value = config.map.get(key)
        if (!value) return []
        const decoded = codec.decode(value)
        if (!decoded) return []
        return [decoded]
      })

      return Ok(values)
    },

    async set<T>(codec: Codec<T>, ...entries: [string, T][]) {
      for (const [key, value] of entries) {
        config.map.set(key, codec.encode(value))
      }
      return Ok(null)
    },

    async zap(keys: string[]) {
      for (const key of keys) {
        config.map.delete(key)
      }
      return Ok(null)
    },
  }
}
