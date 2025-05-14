import { Err, Ok } from '~/@/result'
import { IVerifySms } from '../interface/interface'

export type Config = {
  t: 'fake'
}

const FAKE_CODE = '123'

export const VerifySms = (_config: Config): IVerifySms => {
  return {
    async sendCode(_input) {
      return Ok(null)
    },
    async verifyCode(input) {
      if (input.code === FAKE_CODE) {
        return Ok(null)
      }
      return Err(new Error('Wrong code'))
    },
  }
}
