import { it, expect, describe } from 'bun:test'
import { rescale } from './rescale'

describe('rescale', async () => {
  it('rescales', async () => {
    expect(
      rescale({
        value: 10,
        from: [0, 100],
        to: [0, 10],
      }),
    ).toEqual(1)
  })
})
