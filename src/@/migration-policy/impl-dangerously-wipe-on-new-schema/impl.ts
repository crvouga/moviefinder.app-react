import { z } from 'zod'
import { Codec } from '~/@/codec'
import { toDeterministicHash } from '~/@/deterministic-hash'
import { ILogger } from '~/@/logger'
import { isErr } from '~/@/result'
import { IKvDb } from '../../kv-db/interface'
import { IMigrationPolicy } from '../interface'

export type Config = {
  t: 'dangerously-wipe-on-new-schema'
  kvDb: IKvDb
  logger: ILogger
}

const Entry = z.object({
  up: z.array(z.string()),
  down: z.array(z.string()),
})

type Entry = z.infer<typeof Entry>

const EntryCodec: Codec<Entry> = {
  encode: (input) => {
    try {
      return JSON.stringify(input)
    } catch (error) {
      return ''
    }
  },
  decode: (input) => {
    try {
      return Entry.parse(JSON.parse(input))
    } catch (error) {
      return null
    }
  },
}

const hashSql = (sql: string[]) => {
  return btoa(toDeterministicHash(sql))
}

export const MigrationPolicy = (config: Config): IMigrationPolicy => {
  const logger = config.logger.prefix(['dangerously-wipe-on-new-schema'])
  return {
    async run(input) {
      const logPayload = {
        up: input.up,
        down: input.down,
      }
      logger.debug('running migration policy', logPayload)
      const key = hashSql(input.up)
      const prevSchemaResult = await config.kvDb.get(EntryCodec, [key])
      if (isErr(prevSchemaResult)) {
        logger.error('failed to get previous schema', { error: prevSchemaResult.error })
        return
      }
      const prevSchema = prevSchemaResult.value[0]
      if (!prevSchema) {
        logger.debug('no previous schema. running up migration', logPayload)

        logger.debug('running down migration to ensure the up migration succeeds', logPayload)

        for (const down of input.down) {
          const downResult = await input.sqlDb.query({
            sql: down,
            params: [],
            parser: z.unknown(),
          })

          if (isErr(downResult)) {
            logger.error('failed to run down migration', { error: downResult.error })
            continue
          }
        }

        logger.debug('running up migration', logPayload)

        for (const up of input.up) {
          const upResult = await input.sqlDb.query({
            sql: up,
            params: [],
            parser: z.unknown(),
          })

          if (isErr(upResult)) {
            logger.error('failed to run up migration', { error: upResult.error })
            continue
          }
        }
        const entryNew: Entry = {
          up: input.up,
          down: input.down,
        }
        logger.debug('up migration complete. writing new schema', { input, entryNew })
        await config.kvDb.set(EntryCodec, [key, entryNew])
        logger.debug('new schema written', { input, entryNew })
        return
      }

      const prevHash = hashSql(prevSchema.up)
      const newHash = hashSql(input.up)
      const didChange = prevHash !== newHash
      if (!didChange) {
        logger.debug('no change in schema. skipping.', logPayload)
        return
      }

      logger.debug('schema changed. running down migration', logPayload)
      for (const down of prevSchema.down) {
        const downResult = await input.sqlDb.query({
          sql: down,
          params: [],
          parser: z.unknown(),
        })
        if (isErr(downResult)) {
          logger.error('failed to run down migration', { error: downResult.error })
          continue
        }
      }

      logger.debug('down migration complete. running up migration', logPayload)
      for (const up of input.up) {
        const upResult = await input.sqlDb.query({
          sql: up,
          params: [],
          parser: z.unknown(),
        })
        if (isErr(upResult)) {
          logger.error('failed to run up migration', { error: upResult.error })
          continue
        }
      }

      logger.debug('up migration complete. writing new schema', logPayload)
      const entryNew: Entry = {
        up: input.up,
        down: input.down,
      }
      await config.kvDb.set(EntryCodec, [key, entryNew])
      logger.debug('new schema written', { input, entryNew })
    },
  }
}
