import { Ok } from '~/@/result'
import { IKvDb } from './interface'

export type Config = {
  t: 'browser-storage'
  storage: Storage
}

export const KvDb = (config: Config): IKvDb => {
  return {
    async get(codec, keys) {
      const values = keys.map((key) => config.storage.getItem(key))

      return Ok(
        values.flatMap((value) => {
          if (!value) return []
          const decoded = codec.decode(value)
          if (!decoded) return []
          return [decoded]
        })
      )
    },
    async set(codec, ...entries) {
      for (const [key, value] of entries) {
        config.storage.setItem(key, codec.encode(value))
      }

      return Ok(null)
    },
    async zap(keys) {
      for (const key of keys) {
        config.storage.removeItem(key)
      }

      return Ok(null)
    },
  }
}
