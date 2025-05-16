import { z } from 'zod'
import { Result } from '~/@/result'
import { DbErr } from '~/@/db/interface/error'

const parser = Result.parser(z.null(), DbErr.parser)

export type MediaDbUpsertOutput = z.infer<typeof parser>

export const MediaDbUpsertOutput = {
  parser,
}
