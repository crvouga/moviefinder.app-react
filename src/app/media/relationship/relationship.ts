import { z } from 'zod'
import { MediaId } from '../media-id'
import { RelationshipId } from './relationship-id'
import { RelationshipType } from './relationship-type'

const parser = z.object({
  id: RelationshipId.parser,
  from: MediaId.parser,
  to: MediaId.parser,
  type: RelationshipType.parser,
  order: z.number().nullable(),
})

export type Relationship = z.infer<typeof parser>

const random = async (override?: Partial<Relationship>): Promise<Relationship> => {
  return {
    id: RelationshipId.fromTmdbId({
      tmdbId: Math.floor(Math.random() * 1000000),
      type: 'recommendation',
    }),
    from: MediaId.fromTmdbId(Math.floor(Math.random() * 1000000)),
    to: MediaId.fromTmdbId(Math.floor(Math.random() * 1000000)),
    type: await RelationshipType.random(),
    order: Math.floor(Math.random() * 1000000),
    ...override,
  }
}

export const Relationship = {
  parser,
  random,
}
