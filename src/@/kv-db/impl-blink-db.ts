import { Codec } from '../codec'
import { isOk } from '../result'
import { IKvDb } from './interface'

export type Config = {
  t: 'cached'
  source: IKvDb
  cache: IKvDb
}

export const KvDb = (config: Config): IKvDb => {
  return {
    async get<T>(codec: Codec<T>, keys: string[]) {
      const gotCache = await config.cache.get(codec, keys)

      if (isOk(gotCache) && gotCache.value.length > 0) {
        return gotCache
      }

      const gotSource = await config.source.get(codec, keys)

      if (isOk(gotSource)) {
        await config.cache.set(
          codec,
          ...gotSource.value.map((value, i): [string, T] => [String(keys[i]), value])
        )
      }

      return gotSource
    },

    async set<T>(codec: Codec<T>, ...entries: [string, T][]) {
      config.cache.set(codec, ...entries)
      return await config.source.set(codec, ...entries)
    },

    async zap(keys) {
      config.cache.zap(keys)
      return await config.source.zap(keys)
    },
  }
}
