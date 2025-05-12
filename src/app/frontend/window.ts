import { z } from 'zod'
import { unwrap } from '~/@/result'
import { Ctx } from './ctx'

export const attachTools = (ctx: Ctx) => {
  // @ts-ignore
  window.ctx = ctx
  // @ts-ignore
  window.q = async (sql: string) => {
    const result = await ctx.dbConn.query({ parser: z.unknown(), sql })

    const { rows } = unwrap(result)
    console.table(rows)
  }
}
