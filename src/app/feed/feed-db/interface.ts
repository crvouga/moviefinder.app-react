import { z } from 'zod'
import { Db } from '~/@/db/interface'
import { Feed } from '../feed'

const parser = Db.parser({
  Entity: Feed.parser,
  Related: z.object({}),
})

export type IFeedDb = Db.Infer<typeof parser>

export const IFeedDb = {
  parser,
}
