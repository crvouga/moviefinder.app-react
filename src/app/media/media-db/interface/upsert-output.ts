import { z } from 'zod'
import { Result } from '~/@/result'
import { AppErr } from '~/@/error'

const parser = Result.parser(z.null(), AppErr.parser)

export type MediaDbUpsertOutput = z.infer<typeof parser>

export const MediaDbUpsertOutput = {
  parser,
}
