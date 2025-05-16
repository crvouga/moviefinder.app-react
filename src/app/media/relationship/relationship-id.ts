import { z } from 'zod';
import { RelationshipType } from './relationship-type';

const parser = z.string()

export type RelationshipId = z.infer<typeof parser>

const fromTmdbId = (input: { tmdbId: number; type: RelationshipType }): RelationshipId => {
  return RelationshipId.parser.parse(`relationship-${input.type}-${input.tmdbId}`)
}

const fromString = (id: string): RelationshipId => {
  return RelationshipId.parser.parse(id)
}

export const RelationshipId = {
  parser,
  fromTmdbId,
  fromString,
}
