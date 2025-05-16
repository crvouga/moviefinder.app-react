import { z } from 'zod'
import { ImageSet } from '~/@/image-set'

export const ImagesConfigurationSchema = z.object({
  base_url: z.string().optional(),
  secure_base_url: z.string().optional(),
  backdrop_sizes: z.array(z.string()).optional(),
  logo_sizes: z.array(z.string()).optional(),
  poster_sizes: z.array(z.string()).optional(),
  profile_sizes: z.array(z.string()).optional(),
  still_sizes: z.array(z.string()).optional(),
  change_keys: z.array(z.string()).optional(),
})

export const parser = z.object({
  images: ImagesConfigurationSchema.optional(),
  change_keys: z.array(z.string()).optional(),
})
export type TmdbConfiguration = z.infer<typeof parser>

const toPosterImageSet = (configuration: TmdbConfiguration, posterPath: string | null): ImageSet => {
  if (!posterPath) return ImageSet.empty()

  const posterSizes = configuration.images?.poster_sizes ?? []
  const baseUrl = configuration.images?.secure_base_url ?? ''
  const lowestToHighestRes = posterSizes.map((size) => `${baseUrl}${size}${posterPath}`)
  const imageSet = ImageSet.init({ lowestToHighestRes })
  return imageSet
}

const toBackdropImageSet = (
  configuration: TmdbConfiguration,
  backdropPath: string | null
): ImageSet => {
  if (!backdropPath) return ImageSet.empty()

  const backdropSizes = configuration.images?.backdrop_sizes ?? []
  const baseUrl = configuration.images?.secure_base_url ?? ''
  const lowestToHighestRes = backdropSizes.map((size) => `${baseUrl}${size}${backdropPath}`)
  const imageSet = ImageSet.init({ lowestToHighestRes })
  return imageSet
}


const toProfileImageSet = (configuration: TmdbConfiguration, profilePath: string | null): ImageSet => {
  if (!profilePath) return ImageSet.empty()

  const profileSizes = configuration.images?.profile_sizes ?? []
  const baseUrl = configuration.images?.secure_base_url ?? ''
  const lowestToHighestRes = profileSizes.map((size) => `${baseUrl}${size}${profilePath}`)
  const imageSet = ImageSet.init({ lowestToHighestRes })
  return imageSet
}

export const TmdbConfiguration = {
  parser,
  toPosterImageSet,
  toBackdropImageSet,
  toProfileImageSet,
}
