import { z } from 'zod'
import { IDb } from '~/@/db/interface'
import { Feed } from '../feed'

const parser = IDb.parser({
  Entity: Feed.parser,
  Related: z.object({}),
})

export type IFeedDb = IDb.Infer<typeof parser>

export const IFeedDb = {
  parser,
}
