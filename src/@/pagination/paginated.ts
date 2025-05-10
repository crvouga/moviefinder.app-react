import { z } from 'zod'

const parser = <T>(t: z.ZodType<T>) => {
  return z.object({
    items: z.array(t),
    total: z.number(),
    offset: z.number(),
    limit: z.number(),
  })
}

export type Paginated<T> = z.infer<ReturnType<typeof parser<T>>>

export const Paginated = {
  parser,
}
