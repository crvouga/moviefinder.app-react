import { z } from 'zod'
import { Db } from '~/@/db/interface'
import { Video } from '../video'

const parser = Db.parser({
  Entity: Video.parser,
  Related: z.object({}),
})

export type IVideoDb = Db.Infer<typeof parser>

export const IVideoDb = {
  parser,
}
