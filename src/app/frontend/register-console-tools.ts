import { z } from 'zod'
import { unwrap } from '~/@/result'
import { Ctx } from './ctx'

export const registerConsoleTools = (ctx: Ctx) => {
  // @ts-ignore
  window.ctx = ctx
  // @ts-ignore
  window.q = async (strings: TemplateStringsArray, ...values: any[]) => {
    const cmd = strings[0]?.trim().toLowerCase()

    // List all tables
    if (cmd === 'dt') {
      const result = await ctx.dbConn.query({
        sql: `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`,
        parser: z.unknown(),
      })
      const { rows } = unwrap(result)
      console.table(rows)
      return
    }

    // Describe table like: q`d tablename`
    if (cmd?.startsWith('d ')) {
      const tableName = cmd.split(/\s+/)[1]
      if (!tableName) {
        console.error('No table name provided')
        return
      }

      const result = await ctx.dbConn.query({
        sql: `
          SELECT 
            column_name, 
            data_type, 
            is_nullable, 
            column_default
          FROM 
            information_schema.columns
          WHERE 
            table_name = $1
          ORDER BY ordinal_position
        `,
        params: [tableName],
        parser: z.unknown(),
      })

      const { rows } = unwrap(result)
      if (rows.length === 0) {
        console.log(`No such table: ${tableName}`)
      } else {
        console.table(rows)
      }
      return
    }

    // Fallback: execute raw SQL
    const sql = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '')

    const result = await ctx.dbConn.query({ parser: z.unknown(), sql })
    const { rows } = unwrap(result)

    if (rows.length === 0) {
      console.log('no rows')
    } else {
      console.table(rows)
    }
  }
}
