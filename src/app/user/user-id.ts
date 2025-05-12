import { z } from 'zod'

const parser = z.string()

export type UserId = z.infer<typeof parser>

export const UserId = {
  parser,
}
