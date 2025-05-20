import { z } from 'zod'

const parser = z.string()

export type CreditId = z.infer<typeof parser>

const fromTmdbId = (id: string): CreditId => {
  return CreditId.parser.parse(`credit-tmdb-${id}`)
}

const toTmdbId = (id: CreditId): string => {
  return id.replace('credit-tmdb-', '')
}

const fromString = (id: string): CreditId => {
  return CreditId.parser.parse(id)
}

export const CreditId = {
  parser,
  fromTmdbId,
  fromString,
  toTmdbId,
}
