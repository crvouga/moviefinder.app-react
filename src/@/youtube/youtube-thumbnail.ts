import { ImageSet } from '../image-set'

const YOUTUBE_THUMBNAIL_SIZES = ['default', 'mqdefault', 'hqdefault'] as const
type ThumbnailSize = (typeof YOUTUBE_THUMBNAIL_SIZES)[number]

const toThumbnailSrc = (key: string, size: ThumbnailSize) =>
  `https://img.youtube.com/vi/${key}/${size}.jpg`

export const toThumbnailImageSet = (input: { youtubeKey: string }): ImageSet =>
  ImageSet.init({
    lowestToHighestRes: YOUTUBE_THUMBNAIL_SIZES.map((size) =>
      toThumbnailSrc(input.youtubeKey, size)
    ),
  })
