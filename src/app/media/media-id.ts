import { z } from 'zod'

const parser = z.string().brand('MediaId')

export type MediaId = z.infer<typeof parser>

export const fromTmdbId = (id: number): MediaId => {
  return MediaId.parser.parse(`media:tmdb:${id}`)
}

export const MediaId = {
  parser,
  fromTmdbId,
}
