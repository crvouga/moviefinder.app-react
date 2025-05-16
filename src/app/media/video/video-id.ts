import { z } from 'zod'

const parser = z.string()

export type VideoId = z.infer<typeof parser>

const fromTmdbId = (id: string): VideoId => {
  return VideoId.parser.parse(`video-tmdb-${id}`)
}

const toTmdbId = (id: VideoId): string => {
  return id.replace('video-tmdb-', '')
}

const fromString = (id: string): VideoId => {
  return VideoId.parser.parse(id)
}

export const VideoId = {
  parser,
  fromTmdbId,
  fromString,
  toTmdbId,
}
