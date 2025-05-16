import { z } from 'zod'
import { unwrap } from '~/@/result'
import { Ctx } from './ctx'

type Command = {
  description: string
  match: RegExp
  handler: (strings: TemplateStringsArray, ...values: any[]) => Promise<void>
}

export const Psql = (config: { ctx: Ctx }) => {
  const commands: Command[] = []

  commands.push({
    description: 'List all tables',
    match: /dt/,
    handler: async (_strings: TemplateStringsArray, ..._values: any[]) => {
      const result = await config.ctx.dbConn.query({
        sql: `
          SELECT 
            t.tablename,
            string_agg(c.column_name, ',' ORDER BY c.ordinal_position) as columns
          FROM pg_catalog.pg_tables t
          LEFT JOIN information_schema.columns c 
            ON c.table_name = t.tablename
          WHERE schemaname = 'public'
          GROUP BY t.tablename
        `,
        parser: z.unknown(),
      })
      const { rows } = unwrap(result)
      console.table(rows)
    },
  })

  commands.push({
    description: 'Describe a table',
    match: /d\s+\w+/,
    handler: async (strings: TemplateStringsArray, ..._values: any[]) => {
      const tableName = strings[0]?.trim().replaceAll('  ', ' ').split(' ')?.[1]
      if (!tableName) {
        console.error('No table name provided')
        return
      }

      const result = await config.ctx.dbConn.query({
        sql: `SELECT column_name, data_type, is_nullable, column_default 
             FROM information_schema.columns 
             WHERE table_name = $1 
             ORDER BY ordinal_position`,
        params: [tableName],
        parser: z.unknown(),
      })

      const { rows } = unwrap(result)
      console.table(rows)
    },
  })

  commands.push({
    description: 'help',
    match: /help|h/,
    handler: async (_strings: TemplateStringsArray, ..._values: any[]) => {
      console.table(commands.map((c) => [c.match.source, c.description]))
    },
  })

  commands.push({
    description: 'Execute a raw SQL query',
    match: /.*/,
    handler: async (strings: TemplateStringsArray, ...values: any[]) => {
      const sql = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '')

      const result = await config.ctx.dbConn.query({ parser: z.unknown(), sql })
      const { rows } = unwrap(result)

      if (rows.length === 0) {
        console.log('no rows')
        return
      }
      console.table(rows)
    },
  })

  return {
    psql: async (strings: TemplateStringsArray, ...values: any[]) => {
      const cmd = strings[0]?.trim().toLowerCase()
      if (!cmd) {
        console.error('No command provided')
        return
      }
      const command = commands.find((c) => c.match.test(cmd))
      if (!command) {
        console.error('Unknown command')
        return
      }
      await command.handler(strings, ...values)
    },
  }
}
