import { describe, expect, test } from 'bun:test'
import { z } from 'zod'
import { ImageSet } from '~/@/image-set'
import { unwrap } from '~/@/result'
import { Fixtures } from './fixture'

describe('MediaDb Images', () => {
  test('poster should NOT be empty', async () => {
    for (const f of await Fixtures()) {
      const result = unwrap(await f.mediaDb.query({ limit: 5, offset: 0 }))
      expect(result.media.items.filter((item) => ImageSet.isEmpty(item.poster))).toEqual([])
    }
  })

  test('post should be all valid urls', async () => {
    for (const f of await Fixtures()) {
      const result = unwrap(await f.mediaDb.query({ limit: 5, offset: 0 }))
      for (const item of result.media.items) {
        for (const poster of item.poster.lowestToHighestRes) {
          z.string().url().parse(poster)
        }
      }
    }
  })

  test('backdrop should NOT be empty', async () => {
    for (const f of await Fixtures()) {
      const result = unwrap(await f.mediaDb.query({ limit: 5, offset: 0 }))
      expect(result.media.items.filter((item) => ImageSet.isEmpty(item.backdrop))).toEqual([])
    }
  })

  test('backdrop should be all valid urls', async () => {
    for (const f of await Fixtures()) {
      const result = unwrap(await f.mediaDb.query({ limit: 5, offset: 0 }))
      for (const item of result.media.items) {
        for (const backdrop of item.backdrop.lowestToHighestRes) {
          z.string().url().parse(backdrop)
        }
      }
    }
  })
})
