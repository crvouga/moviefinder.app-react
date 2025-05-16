import { describe, expect, test } from 'bun:test'
import { MediaId } from './media-id'

describe.only('MediaId', () => {
  test('should covert tmdb id correctly', () => {
    expect(MediaId.toTmdbId(MediaId.fromTmdbId(550))).toBe(550)
  })
})
