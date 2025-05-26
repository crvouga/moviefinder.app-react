import { z } from 'zod'
import { unwrap } from '~/@/result'
import { Ctx } from '../ctx'
import { Command } from './types'

const SQL_SUMMARY = `
SELECT
    relname AS table_name,    
    pg_size_pretty(pg_total_relation_size(relid)) AS total_size
FROM
    pg_stat_user_tables
ORDER BY
    pg_total_relation_size(relid) DESC;
`

const querySummary = async (
  ctx: Ctx
): Promise<{ table_name: string; total_size: string; row_count: string }[]> => {
  // Step 1: Get table names and their total sizes using SQL_SUMMARY logic
  const summaryResult = await ctx.sqlDb.query({
    sql: SQL_SUMMARY, // SQL_SUMMARY is defined above this function
    parser: z.object({
      table_name: z.string(),
      total_size: z.string(),
    }),
  })
  const tablesSummary = unwrap(summaryResult).rows

  if (tablesSummary.length === 0) {
    return []
  }

  // Step 2 & 3: For each table, get its row count and combine with summary info
  const tablesWithDetailsPromises = tablesSummary.map(async (summary) => {
    const tableName = summary.table_name

    const countSql = `SELECT COUNT(*) AS row_count FROM "${tableName}"` // Ensure table name is quoted
    const countResult = await ctx.sqlDb.query({
      sql: countSql,
      parser: z.object({
        // COUNT(*) can return bigint, which might be string or number depending on driver/wasm
        row_count: z.union([z.string(), z.number(), z.bigint()]),
      }),
    })

    // Safely extract and convert row_count
    const countValue = unwrap(countResult).rows[0]?.row_count
    const row_count = Number(countValue?.toString() ?? '0')

    return {
      table_name: tableName,
      total_size: summary.total_size,
      row_count: row_count.toLocaleString(),
    }
  })

  const tablesWithDetails = await Promise.all(tablesWithDetailsPromises)

  // The SQL_SUMMARY query already sorts by total_size DESC.
  // If a different sort order is needed, it can be applied here.
  return tablesWithDetails
}

const register = (input: { commands: Command[]; ctx: Ctx }) => {
  input.commands.push({
    description: 'Summarize the database',
    match: /summary/,
    handler: async (_strings: TemplateStringsArray, ..._values: any[]) => {
      const rows = await querySummary(input.ctx)
      console.table(rows)
    },
  })
}

export const PsqlSummary = {
  register,
}
