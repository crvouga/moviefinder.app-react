import { Paginated } from '~/@/pagination/paginated'
import { isErr, Result } from '~/@/result'
import { Feed } from '../../feed'

export type FeedDbQueryOutput = Result<Paginated<Feed>, Error>

const first = (input: FeedDbQueryOutput | null | undefined): Feed | null => {
  if (!input) return null
  if (isErr(input)) return null
  return input.value.items[0] ?? null
}
export const FeedDbQueryOutput = {
  first,
}
