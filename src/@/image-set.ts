import { z } from 'zod'
import { createFaker } from './faker'

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

const toHighestRes = (imageSet: ImageSet | undefined): string | undefined => {
  if (!imageSet) return undefined
  const maybeSrc = imageSet.lowestToHighestRes[imageSet.lowestToHighestRes.length - 1]
  return maybeSrc ?? undefined
}

const toMiddleRes = (imageSet: ImageSet | undefined): string | undefined => {
  if (!imageSet) return undefined
  const middleIndex = Math.floor((imageSet.lowestToHighestRes.length + 1) / 2)
  const maybeSrc = imageSet.lowestToHighestRes[middleIndex]
  return maybeSrc ?? undefined
}

const isEmpty = (imageSet: ImageSet): boolean => {
  return imageSet.lowestToHighestRes.length === 0
}

const random = async (): Promise<ImageSet> => {
  const faker = await createFaker()

  return {
    lowestToHighestRes: [faker.image.url(), faker.image.url(), faker.image.url()],
  }
}

const toLowestRes = (imageSet: ImageSet | undefined): string | undefined => {
  if (!imageSet) return undefined
  const maybeSrc = imageSet.lowestToHighestRes[0]
  return maybeSrc ?? undefined
}

export const ImageSet = {
  parser,
  random,
  init,
  empty,
  toHighestRes,
  toMiddleRes,
  toLowestRes,
  isEmpty,
}
