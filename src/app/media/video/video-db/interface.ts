import { z } from 'zod'
import { Db } from '~/@/db/interface'
import { Video } from '../video'

const parser = Db.parser({
  Field: z.enum([
    'id',
    'iso_639_1',
    'iso_3166_1',
    'name',
    'key',
    'site',
    'size',
    'type',
    'official',
    'publishedAt',
  ]),
  Entity: Video.parser,
  Related: z.object({}),
})

export type IVideoDb = Db.Infer<typeof parser>

export const IVideoDb = {
  parser,
}
