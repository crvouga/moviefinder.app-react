import { describe, expect, it } from 'bun:test'
import { Codec } from '~/@/codec'
import { Ok } from '~/@/result'
import { Fixtures } from './fixture'

describe('KvDb', () => {
  it('should get, set, and zap values', async () => {
    for (const f of await Fixtures()) {
      const codec: Codec<string> = {
        encode: (value) => value,
        decode: (value) => value,
      }

      const before = await f.kvDb.get(codec, ['test-key'])
      const set = await f.kvDb.set(codec, ['test-key', 'test-value'])
      const after = await f.kvDb.get(codec, ['test-key'])
      const zap = await f.kvDb.zap(['test-key'])
      const afterZap = await f.kvDb.get(codec, ['test-key'])
      const setAfterZap = await f.kvDb.set(codec, ['test-key', 'test-value-2'])
      const afterSetAfterZap = await f.kvDb.get(codec, ['test-key'])

      expect(before).toEqual(Ok([]))
      expect(set).toEqual(Ok(null))
      expect(after).toEqual(Ok(['test-value']))
      expect(zap).toEqual(Ok(null))
      expect(afterZap).toEqual(Ok([]))
      expect(setAfterZap).toEqual(Ok(null))
      expect(afterSetAfterZap).toEqual(Ok(['test-value-2']))
    }
  })
})
