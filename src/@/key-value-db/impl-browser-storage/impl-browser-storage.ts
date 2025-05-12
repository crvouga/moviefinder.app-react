import { Ok } from '../../result'
import { IKeyValueDb } from '../interface'

export type Config = {
  t: 'browser-storage'
  storage: Storage
}

export const KeyValueDb = (config: Config): IKeyValueDb => {
  return {
    async get(codec, key) {
      const value = config.storage.getItem(key)

      if (!value) return Ok(null)

      return Ok(codec.decode(value))
    },
    async set(codec, key, value) {
      config.storage.setItem(key, codec.encode(value))

      return Ok(null)
    },
    async zap(key) {
      config.storage.removeItem(key)

      return Ok(null)
    },
  }
}
