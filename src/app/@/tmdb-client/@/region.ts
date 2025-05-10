import { z } from 'zod'

export const ISO_3166_1_REGEX = /^[A-Z]{2}$/

export const Region = z.string().regex(ISO_3166_1_REGEX)
