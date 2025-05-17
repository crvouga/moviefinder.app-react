export const enumerate = <T>(array: T[]): [number, T][] => {
  return array.map((value, index) => [index, value])
}
