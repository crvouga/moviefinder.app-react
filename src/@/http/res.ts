import { z } from 'zod'

const parser = z.object({
  status: z.number(),
  body: z.string(),
  headers: z.record(z.string(), z.string()),
})
export type HttpRes = z.infer<typeof parser>

export const HttpRes = {
  parser,
}
