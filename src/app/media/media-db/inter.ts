import { MediaDbQueryInput } from './query-input'
import { MediaDbQueryOutput } from './query-output'

export type IMediaDb = {
  query: (query: MediaDbQueryInput) => Promise<MediaDbQueryOutput>
}
