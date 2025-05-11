/**
 * Clone a value
 * @param value - The value to clone
 * @returns A deep clone of the value
 */
export const clone = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value))
}
