import { Codec } from '../codec'
import { IKvDb } from './interface'

export type Config = {
  t: 'namespaced'
  kvDb: IKvDb
  namespace: string[]
}

export const KvDb = (config: Config): IKvDb => {
  const toNamespaceKey = (key: string) => [...config.namespace, key].join(':')
  return {
    async get(codec, keys) {
      return await config.kvDb.get(codec, keys.map(toNamespaceKey))
    },
    async set<T>(codec: Codec<T>, ...entries: [string, T][]) {
      return await config.kvDb.set(
        codec,
        ...entries.map(([key, value]): [string, T] => [toNamespaceKey(key), value])
      )
    },
    async zap(keys) {
      return await config.kvDb.zap(keys.map(toNamespaceKey))
    },
  }
}
