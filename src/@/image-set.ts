import { faker } from '@faker-js/faker'
import { z } from 'zod'

const parser = z.object({
  lowestToHighestRes: z.array(z.string()),
})

export type ImageSet = z.infer<typeof parser>

const init = (input: { lowestToHighestRes: string[] }): ImageSet => {
  return {
    lowestToHighestRes: input.lowestToHighestRes,
  }
}

const empty = (): ImageSet => ({
  lowestToHighestRes: [],
})

const toHighestRes = (imageSet: ImageSet): string | undefined => {
  const maybeSrc = imageSet.lowestToHighestRes[imageSet.lowestToHighestRes.length - 1]
  return maybeSrc ?? undefined
}

const toMiddleRes = (imageSet: ImageSet): string | undefined => {
  const middleIndex = Math.floor((imageSet.lowestToHighestRes.length + 1) / 2)
  const maybeSrc = imageSet.lowestToHighestRes[middleIndex]
  return maybeSrc ?? undefined
}

const isEmpty = (imageSet: ImageSet): boolean => {
  return imageSet.lowestToHighestRes.length === 0
}

const random = (): ImageSet => {
  return {
    lowestToHighestRes: [faker.image.url(), faker.image.url(), faker.image.url()],
  }
}

export const ImageSet = {
  parser,
  random,
  init,
  empty,
  toHighestRes,
  toMiddleRes,
  isEmpty,
}
