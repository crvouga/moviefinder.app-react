import { z } from 'zod'

export const ISO_639_1_REGEX = /^[a-z]{2}$/

export const Language = z.string().regex(ISO_639_1_REGEX).default('en-US')
