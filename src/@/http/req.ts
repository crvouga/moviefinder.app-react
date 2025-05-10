import { z } from 'zod'

const parser = z.object({
  url: z.string(),
  method: z.string(),
  body: z.string(),
  headers: z.record(z.string(), z.string()),
})
export type HttpReq = z.infer<typeof parser>

export const HttpReq = {
  parser,
}
