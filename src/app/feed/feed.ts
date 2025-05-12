import { z } from 'zod'
import { ClientSessionId } from '../@/client-session-id/client-session-id'
import { FeedId } from './feed-id'

const parser = z.object({
  id: FeedId.parser,
  clientSessionId: ClientSessionId.parser,
  activeIndex: z.number().int().min(0),
})

export type Feed = z.infer<typeof parser>

export const Feed = {
  parser,
}
