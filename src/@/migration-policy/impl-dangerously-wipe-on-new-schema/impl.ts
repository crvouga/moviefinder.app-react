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
      const logPayload = {
        up: input.up,
        down: input.down,
      }
      logger.info('running migration policy', logPayload)
      const key = await hash(input.up)
      const prevSchema = await config.keyValueDb.get(EntryCodec, key)
      if (isErr(prevSchema)) {
        logger.error('failed to get previous schema', { error: prevSchema.error })
        return
      }
      if (!prevSchema.value) {
        logger.info('no previous schema. running up migration', logPayload)

        logger.info('running down migration to ensure the up migration succeeds', logPayload)

        await input.sqlDb.query({ sql: input.down, params: [], parser: z.unknown() })

        logger.info('running up migration', logPayload)

        await input.sqlDb.query({
          sql: input.up,
          params: [],
          parser: z.unknown(),
        })
        const entryNew: Entry = {
          up: input.up,
          down: input.down,
        }
        logger.info('up migration complete. writing new schema', { input, entryNew })
        await config.keyValueDb.set(EntryCodec, key, entryNew)
        logger.info('new schema written', { input, entryNew })
        return
      }

      const prevHash = await hash(prevSchema.value?.up.trim() ?? '')
      const newHash = await hash(input.up.trim())
      const didChange = prevHash !== newHash
      if (!didChange) {
        logger.info('no change in schema. skipping.', logPayload)
        return
      }

      logger.info('schema changed. running down migration', logPayload)
      await input.sqlDb.query({
        sql: prevSchema.value.down,
        params: [],
        parser: z.unknown(),
      })
      logger.info('down migration complete. running up migration', logPayload)
      await input.sqlDb.query({
        sql: input.up,
        params: [],
        parser: z.unknown(),
      })
      logger.info('up migration complete. writing new schema', logPayload)
      const entryNew: Entry = {
        up: input.up,
        down: input.down,
      }
      await config.keyValueDb.set(EntryCodec, key, entryNew)
      logger.info('new schema written', { input, entryNew })
    },
  }
}
