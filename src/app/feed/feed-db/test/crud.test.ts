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
    const put = await f.feedDb.upsert([feed])
    const after = await f.feedDb.query({
      where: { op: '=', column: 'id', value: feed.id },
      limit: 1,
      offset: 0,
    })
    expect(before).toEqual(Ok({ items: [], total: 0, offset: 0, limit: 1 }))
    expect(put).toEqual(Ok(null))
    expect(after).toEqual(
      Ok({
        items: [feed],
        total: 1,
        offset: 0,
        limit: 1,
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
    const put = await f.feedDb.upsert([feed])
    const after = await f.feedDb.query({
      where: { op: '=', column: 'id', value: feed.id },
      limit: 1,
      offset: 0,
    })
    const feedNew: Feed = { ...feed, activeIndex: feed.activeIndex + 1 }
    const putNew = await f.feedDb.upsert([feedNew])
    const afterNew = await f.feedDb.query({
      where: { op: '=', column: 'id', value: feed.id },
      limit: 1,
      offset: 0,
    })
    expect(before).toEqual(Ok({ items: [], total: 0, offset: 0, limit: 1 }))
    expect(put).toEqual(Ok(null))
    expect(after).toEqual(Ok({ items: [feed], total: 1, offset: 0, limit: 1 }))
    expect(putNew).toEqual(Ok(null))
    expect(afterNew).toEqual(Ok({ items: [feedNew], total: 1, offset: 0, limit: 1 }))
  })
})
