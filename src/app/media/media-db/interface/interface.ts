import { Sub } from '~/@/pub-sub'
import { MediaDbQueryInput } from './query-input'
import { MediaDbQueryOutput } from './query-output'
import { MediaDbUpsertInput } from './upsert-input'
import { MediaDbUpsertOutput } from './upsert-output'

export type IMediaDb = {
  query: (query: MediaDbQueryInput) => Promise<MediaDbQueryOutput>
  liveQuery: (query: MediaDbQueryInput) => Sub<MediaDbQueryOutput>
  upsert: (input: MediaDbUpsertInput) => Promise<MediaDbUpsertOutput>
}
