import { describe, expect, it } from 'bun:test'
import { isOk } from '~/@/result'
import { Fixture } from './fixture'

describe('query', () => {
  it('should work', async () => {
    const f = await Fixture()

    const result = await f.mediaDb.query({
      limit: 10,
      offset: 0,
    })

    expect(isOk(result)).toBe(true)
  })
})
