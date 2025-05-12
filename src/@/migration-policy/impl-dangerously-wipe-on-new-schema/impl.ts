import { z } from 'zod'
import { Codec } from '~/@/codec'
import { ILogger, Logger } from '~/@/logger'
import { isErr } from '~/@/result'
import { IKeyValueDb } from '../../key-value-db/interface'
import { IMigrationPolicy } from '../interface'

export type Config = {
  t: 'dangerously-wipe-on-new-schema'
  keyValueDb: IKeyValueDb
  logger: ILogger
}

const Entry = z.object({
  up: z.string(),
  down: z.string(),
  key: z.string(),
})

type Entry = z.infer<typeof Entry>

const EntryCodec: Codec<Entry> = {
  encode: (input) => JSON.stringify(input),
  decode: (input) => Entry.parse(JSON.parse(input)),
}

const hash = async (up: string) => {
  const msgBuffer = new TextEncoder().encode(up.trim())
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const MigrationPolicy = (config: Config): IMigrationPolicy => {
  const logger = Logger.prefix('dangerously-wipe-on-new-schema', config.logger)
  return {
    async run(input) {
      logger.info('running migration policy', { input })
      const prevSchema = await config.keyValueDb.get(EntryCodec, input.key)
      if (isErr(prevSchema)) {
        logger.error('failed to get previous schema', { error: prevSchema.error })
        return
      }
      if (!prevSchema.value) {
        logger.info('no previous schema. running up migration', { input })
        await input.dbConn.query({
          sql: input.up,
          params: [],
          parser: z.unknown(),
        })

        const entryNew: Entry = {
          up: input.up,
          down: input.down,
          key: input.key,
        }
        logger.info('up migration complete. writing new schema', { input, entryNew })
        await config.keyValueDb.set(EntryCodec, input.key, entryNew)
        logger.info('new schema written', { input, entryNew })
        return
      }
      const didChange = hash(prevSchema.value?.up.trim() ?? '') !== hash(input.up.trim())

      if (!didChange) {
        logger.info('no change in schema. skipping.', { input })
        return
      }

      logger.info('schema changed. running down migration', { input })
      await input.dbConn.query({
        sql: prevSchema.value.down,
        params: [],
        parser: z.unknown(),
      })
      logger.info('down migration complete. running up migration', { input })
      await input.dbConn.query({
        sql: input.up,
        params: [],
        parser: z.unknown(),
      })
      logger.info('up migration complete. writing new schema', { input })
      const entryNew: Entry = {
        up: input.up,
        down: input.down,
        key: input.key,
      }
      await config.keyValueDb.set(EntryCodec, input.key, entryNew)
      logger.info('new schema written', { input, entryNew })
    },
  }
}
