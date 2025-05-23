import { ImageSet } from '../image-set'

export const toThumbnailSrc = (input: { key: string; size: 'default' | 'medium' | 'high' }) => {
  return `https://img.youtube.com/vi/${input.key}/${input.size}.jpg`
}

export const toThumbnailImageSet = (input: { key: string }): ImageSet => {
  return ImageSet.init({
    lowestToHighestRes: [
      toThumbnailSrc({ key: input.key, size: 'default' }),
      toThumbnailSrc({ key: input.key, size: 'medium' }),
      toThumbnailSrc({ key: input.key, size: 'high' }),
    ],
  })
}
