import { describe, expect, it } from 'bun:test'
import { Ok } from '~/@/result'
import { Feed } from '../../feed'
import { Fixture } from './fixture'

describe('FeedDb - CRUD', () => {
  it('should create a feed', async () => {
    const f = await Fixture()
    const feed = Feed.random()
    const before = await f.feedDb.query({
      where: { op: '=', column: 'id', value: feed.id },
      limit: 1,
      offset: 0,
    })
    const put = await f.feedDb.upsert({ entities: [feed] })
    const after = await f.feedDb.query({
      where: { op: '=', column: 'id', value: feed.id },
      limit: 1,
      offset: 0,
    })
    expect(before).toEqual(
      Ok({ entities: { items: [], total: 0, offset: 0, limit: 1 }, related: {} })
    )
    expect(put).toEqual(Ok({ entities: [feed] }))
    expect(after).toEqual(
      Ok({
        entities: { items: [feed], total: 1, offset: 0, limit: 1 },
        related: {},
      })
    )
  })

  it('should update a feed', async () => {
    const f = await Fixture()
    const feed = Feed.random()
    const before = await f.feedDb.query({
      where: { op: '=', column: 'id', value: feed.id },
      limit: 1,
      offset: 0,
    })
    const put = await f.feedDb.upsert({ entities: [feed] })
    const after = await f.feedDb.query({
      where: { op: '=', column: 'id', value: feed.id },
      limit: 1,
      offset: 0,
    })
    const feedNew: Feed = { ...feed, activeIndex: feed.activeIndex + 1 }
    const putNew = await f.feedDb.upsert({ entities: [feedNew] })
    const afterNew = await f.feedDb.query({
      where: { op: '=', column: 'id', value: feed.id },
      limit: 1,
      offset: 0,
    })
    expect(before).toEqual(
      Ok({ entities: { items: [], total: 0, offset: 0, limit: 1 }, related: {} })
    )
    expect(put).toEqual(Ok({ entities: [feed] }))
    expect(after).toEqual(
      Ok({ entities: { items: [feed], total: 1, offset: 0, limit: 1 }, related: {} })
    )
    expect(putNew).toEqual(Ok({ entities: [feedNew] }))
    expect(afterNew).toEqual(
      Ok({ entities: { items: [feedNew], total: 1, offset: 0, limit: 1 }, related: {} })
    )
  })
})
