import { ImplTrpcClient } from './impl-trpc-client'
import { IMediaDb } from './interface'

export type Config = ImplTrpcClient.Config

export const MediaDbFrontend = (config: Config): IMediaDb => {
  switch (config.t) {
    case 'trpc-client': {
      return ImplTrpcClient.MediaDb(config)
    }
  }
}
