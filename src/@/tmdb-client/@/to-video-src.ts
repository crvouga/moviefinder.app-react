import { TmdbMovieVideo } from '../movie/videos'

export const toVideoSrc = (data: TmdbMovieVideo) => {
  const { site, key } = data
  if (!key) {
    return null
  }

  if (!site) {
    return null
  }

  if (site === 'YouTube') {
    return `https://www.youtube.com/embed/${key}`
  }

  return null
}
