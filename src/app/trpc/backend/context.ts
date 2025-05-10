import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

export const createContext = (input: FetchCreateContextFnOptions) => {
  const user = { name: input.req.headers.get('username') ?? 'anonymous' }
  return { req: input.req, resHeaders: input.resHeaders, user }
}

export type Context = Awaited<ReturnType<typeof createContext>>
