import { TmdbConfiguration } from '../configuration/configuration'

export const toTmdbImageUrl = (
  config: TmdbConfiguration,
  posterPath: string | undefined | null
): string | null => {
  if (!posterPath) return null

  const base = config?.images?.secure_base_url

  if (!base) return null

  const posterSizes = config?.images?.poster_sizes

  if (!posterSizes) return null

  const posterSize = posterSizes?.[posterSizes.length - 1]

  if (!posterSize) return null

  return `${base}${posterSize}${posterPath}`
}
