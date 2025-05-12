import { IKeyValueDb } from '~/@/key-value-db/interface'
import { Result } from '~/@/result'
import { ClientSessionId } from './client-session-id'

export type IClientSessionIdStorage = {
  get: () => Promise<Result<ClientSessionId | null, Error>>
  set: (clientSessionId: ClientSessionId) => Promise<Result<unknown, Error>>
}

const KEY = 'client-session-id'
export const ClientSessionIdStorage = (config: {
  keyValueDb: IKeyValueDb
}): IClientSessionIdStorage => {
  return {
    async get() {
      const got = await config.keyValueDb.get(ClientSessionId.codec, KEY)
      return got
    },
    async set(clientSessionId) {
      const set = await config.keyValueDb.set(ClientSessionId.codec, KEY, clientSessionId)
      return set
    },
  }
}
