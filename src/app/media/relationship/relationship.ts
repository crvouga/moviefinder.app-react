import { z } from 'zod'
import { MediaId } from '../media-id'
import { RelationshipId } from './relationship-id'
import { RelationshipType } from './relationship-type'

const parser = z.object({
  id: RelationshipId.parser,
  from: MediaId.parser,
  to: MediaId.parser,
  type: RelationshipType.parser,
})

export type Relationship = z.infer<typeof parser>

const random = async (override?: Partial<Relationship>): Promise<Relationship> => {
  return {
    id: RelationshipId.fromTmdbId(Math.floor(Math.random() * 1000000)),
    from: MediaId.fromTmdbId(Math.floor(Math.random() * 1000000)),
    to: MediaId.fromTmdbId(Math.floor(Math.random() * 1000000)),
    type: await RelationshipType.random(),
    ...override,
  }
}

export const Relationship = {
  parser,
  random,
}
