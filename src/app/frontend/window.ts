import { z } from 'zod'
import { unwrap } from '~/@/result'
import { Ctx } from './ctx'

export const attachTools = (ctx: Ctx) => {
  // @ts-ignore
  window.ctx = ctx
  // @ts-ignore
  window.q = async (strings: TemplateStringsArray, ...values: any[]) => {
    const sql = strings.reduce((acc, str, i) => {
      return acc + str + (values[i] ?? '')
    }, '')

    const result = await ctx.dbConn.query({ parser: z.unknown(), sql })

    const { rows } = unwrap(result)
    if (rows.length === 0) {
      console.log('no rows')
    } else {
      console.table(rows)
    }
  }
}
