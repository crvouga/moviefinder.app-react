import { z } from 'zod'

const parser = z.string()

export type MediaId = z.infer<typeof parser>

const fromTmdbId = (id: number): MediaId => {
  return MediaId.parser.parse(`media-tmdb-${id}`)
}

const toTmdbId = (id: MediaId): number => {
  return parseInt(id.replace('media-tmdb-', ''))
}

const fromString = (id: string): MediaId => {
  return MediaId.parser.parse(id)
}

export const MediaId = {
  parser,
  fromTmdbId,
  fromString,
  toTmdbId,
}
