import { describe, expect, it } from 'bun:test'
import { isOk } from '~/@/result'
import { Fixtures } from './fixture'

describe('MediaDb Query', () => {
  it('should work', async () => {
    for (const f of await Fixtures()) {
      const result = await f.mediaDb.query({ limit: 10, offset: 0 })

      expect(isOk(result)).toBe(true)
    }
  })
})
