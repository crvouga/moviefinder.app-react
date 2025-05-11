import { MediaDbQueryInput } from './query-input'
import { MediaDbQueryOutput } from './query-output'
import { MediaDbUpsertInput } from './upsert-input'
import { MediaDbUpsertOutput } from './upsert-output'

export type IMediaDb = {
  query: (query: MediaDbQueryInput) => Promise<MediaDbQueryOutput>
  upsert: (input: MediaDbUpsertInput) => Promise<MediaDbUpsertOutput>
}
