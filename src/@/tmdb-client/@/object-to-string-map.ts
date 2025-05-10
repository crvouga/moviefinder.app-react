export const objectToStringMap = <T extends { [s: string]: unknown }>(
  obj: T
): Record<string, string> => {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    result[key] = String(value)
  }
  return result
}
