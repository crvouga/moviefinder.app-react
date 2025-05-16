import { z } from 'zod'

const parser = z
  .object({
    message: z.unknown(),
  })
  .passthrough()

export type AppErr = z.infer<typeof parser>

const from = <T>(error: T): AppErr => {
  if (error instanceof Error) {
    return {
      ...error,
      message: error.message,
    }
  }

  if (typeof error === 'string') {
    return {
      message: error,
    }
  }

  return {
    ...error,
    message: 'Unknown error',
  }
}

export const AppErr = {
  parser,
  from,
}
