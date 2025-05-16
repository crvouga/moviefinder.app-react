import { z } from 'zod'

const parser = z
  .object({
    message: z.unknown(),
  })
  .passthrough()
  
export type DbErr = z.infer<typeof parser>

const from = <T>(error: T): DbErr => {
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

export const DbErr = {
  parser,
  from,
}
