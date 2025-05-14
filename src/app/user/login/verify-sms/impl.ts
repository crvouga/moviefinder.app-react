import { ImplFake } from './impl-fake'
import { IVerifySms } from './interface/interface'

export type Config = ImplFake.Config

export const VerifySms = (config: Config): IVerifySms => {
  switch (config.t) {
    case 'fake':
      return ImplFake.VerifySms(config)
    default:
      throw new Error('Invalid config')
  }
}
