import { describe, expect, it } from 'bun:test'
import { Codec } from '~/@/codec'
import { Ok } from '~/@/result'
import { Fixtures } from './fixture'

describe.only('KeyValueDb', () => {
  it('should get, set, and zap values', async () => {
    for (const f of await Fixtures()) {
      const codec: Codec<string> = {
        encode: (value) => value,
        decode: (value) => value,
      }

      const before = await f.keyValueDb.get(codec, 'test-key')
      const set = await f.keyValueDb.set(codec, 'test-key', 'test-value')
      const after = await f.keyValueDb.get(codec, 'test-key')
      const zap = await f.keyValueDb.zap('test-key')
      const afterZap = await f.keyValueDb.get(codec, 'test-key')
      const setAfterZap = await f.keyValueDb.set(codec, 'test-key', 'test-value-2')
      const afterSetAfterZap = await f.keyValueDb.get(codec, 'test-key')

      expect(before).toEqual(Ok(null))
      expect(set).toEqual(Ok(null))
      expect(after).toEqual(Ok('test-value'))
      expect(zap).toEqual(Ok(null))
      expect(afterZap).toEqual(Ok(null))
      expect(setAfterZap).toEqual(Ok(null))
      expect(afterSetAfterZap).toEqual(Ok('test-value-2'))
    }
  })
})
