import { z } from 'zod'

const parser = z.string()

export type RelationshipId = z.infer<typeof parser>

const fromTmdbId = (id: number): RelationshipId => {
  return RelationshipId.parser.parse(`relationship-tmdb-${id}`)
}

const toTmdbId = (id: RelationshipId): number => {
  return parseInt(id.replace('relationship-tmdb-', ''))
}

const fromString = (id: string): RelationshipId => {
  return RelationshipId.parser.parse(id)
}

export const RelationshipId = {
  parser,
  fromTmdbId,
  fromString,
  toTmdbId,
}
