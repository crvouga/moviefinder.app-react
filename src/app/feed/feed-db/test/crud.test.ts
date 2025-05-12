import { describe, expect, it } from 'bun:test'
import { Ok } from '~/@/result'
import { Feed } from '../../feed'
import { Fixture } from './fixture'

describe('FeedDb - CRUD', () => {
  it('should create a feed', async () => {
    const f = await Fixture()
    const feed = Feed.random()
    const before = await f.feedDb.get(feed.id)
    const put = await f.feedDb.put(feed)
    const after = await f.feedDb.get(feed.id)
    expect(before).toEqual(Ok(null))
    expect(put).toEqual(Ok(null))
    expect(after).toEqual(Ok(feed))
  })

  it('should update a feed', async () => {
    const f = await Fixture()
    const feed = Feed.random()
    const before = await f.feedDb.get(feed.id)
    const put = await f.feedDb.put(feed)
    const after = await f.feedDb.get(feed.id)
    const feedNew: Feed = { ...feed, activeIndex: feed.activeIndex + 1 }
    const putNew = await f.feedDb.put(feedNew)
    const afterNew = await f.feedDb.get(feed.id)
    expect(before).toEqual(Ok(null))
    expect(put).toEqual(Ok(null))
    expect(after).toEqual(Ok(feed))
    expect(putNew).toEqual(Ok(null))
    expect(afterNew).toEqual(Ok(feedNew))
  })
})
