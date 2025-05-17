import { z } from 'zod'

export const keyOf = <T extends Record<string, unknown>>(
  zod: z.ZodObject<z.ZodRawShape>
): z.ZodType<keyof T> => {
  return z.enum(Object.keys(zod.shape).map(String) as [string, ...string[]]) as z.ZodType<keyof T>
}
