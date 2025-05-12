import { ClientSessionId } from './client-session-id'

export type IClientSessionIdStorage = {
  get: () => ClientSessionId | null
  set: (clientSessionId: ClientSessionId) => unknown
}

export const ClientSessionIdStorage = (config: { storage: Storage }): IClientSessionIdStorage => {
  const KEY = 'client-session-id'
  return {
    get() {
      const got = config.storage.getItem(KEY)
      return got ? ClientSessionId.fromString(got) : null
    },
    set(clientSessionId) {
      config.storage.setItem(KEY, clientSessionId.toString())
    },
  }
}
