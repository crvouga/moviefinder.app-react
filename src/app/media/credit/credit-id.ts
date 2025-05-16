import { z } from 'zod'

const parser = z.string()

export type CreditId = z.infer<typeof parser>

const fromTmdbId = (id: number): CreditId => {
  return CreditId.parser.parse(`credit-tmdb-${id}`)
}

const toTmdbId = (id: CreditId): number => {
  return parseInt(id.replace('credit-tmdb-', ''))
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
