import { useEffect } from 'react'
import { QueryOutput } from '~/@/db/interface/query-output/query-output'
import { preloadImages } from '~/@/ui/img'
import { Ctx } from '~/app/backend/ctx'
import { useCtx } from '~/app/frontend/ctx'
import { MediaId } from '../media-id'

export const preloadMedia = async (input: { ctx: Ctx; mediaId: MediaId }) => {
  const got = await input.ctx.mediaDb.query({
    where: { op: '=', column: 'id', value: input.mediaId },
    limit: 1,
    offset: 0,
  })

  const srcList: (string | undefined)[] = []

  const media = QueryOutput.first(got)

  if (media) {
    srcList.push(...media.backdrop.lowestToHighestRes)
  }

  const related = QueryOutput.related(got)

  if (related) {
    srcList.push(
      ...Object.values(related.media).flatMap((media) => media.backdrop.lowestToHighestRes),
      ...Object.values(related.media).flatMap((media) => media.poster.lowestToHighestRes),
      ...Object.values(related.person).flatMap((person) => person.profile.lowestToHighestRes)
    )
  }

  preloadImages({ srcList })
}

export const usePreloadMedia = (input: { mediaId: MediaId }) => {
  const { mediaId } = input
  const ctx = useCtx()
  useEffect(() => {
    preloadMedia({ ctx, mediaId })
  }, [mediaId])
}

export const PreloadMedia = (props: { mediaId: MediaId }) => {
  usePreloadMedia(props)

  return null
}
