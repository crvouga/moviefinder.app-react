import { z } from 'zod'
import { IDb } from '~/@/db/interface'
import { Video } from '../video'

const parser = IDb.parser({
  Entity: Video.parser,
  Related: z.object({}),
})

export type IVideoDb = IDb.Infer<typeof parser>

export const IVideoDb = {
  parser,
}
