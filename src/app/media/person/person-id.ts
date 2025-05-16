import { z } from 'zod'

const parser = z.string()

export type PersonId = z.infer<typeof parser>

const fromTmdbId = (id: number): PersonId => {
  return PersonId.parser.parse(`person-tmdb-${id}`)
}

const toTmdbId = (id: PersonId): number => {
  return parseInt(id.replace('person-tmdb-', ''))
}

const fromString = (id: string): PersonId => {
  return PersonId.parser.parse(id)
}

export const PersonId = {
  parser,
  fromTmdbId,
  fromString,
  toTmdbId,
}
