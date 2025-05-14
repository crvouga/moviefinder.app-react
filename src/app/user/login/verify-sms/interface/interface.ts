import { Result } from '~/@/result'

export type IVerifySms = {
  sendCode: (input: { phoneNumber: string }) => Promise<Result<null, Error>>
  verifyCode: (input: { phoneNumber: string; code: string }) => Promise<Result<null, Error>>
}
