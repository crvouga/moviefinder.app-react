import { z } from 'zod'

export const ErrResponse = z.object({
  status_message: z.string().optional(),
  status_code: z.number().int().optional(),
})

export type ErrResponse = z.infer<typeof ErrResponse>
