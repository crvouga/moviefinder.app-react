import { z } from 'zod'

//  https://www.themoviedb.org/settings/api
export const API_KEY_REGEX = /^[a-f0-9]{32}$/

export const TmdbApiKey = z.string().nonempty().default('<<api_key>>')
