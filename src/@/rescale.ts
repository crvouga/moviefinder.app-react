type Range = [number, number]
/**
 * @example
 * // assume a ∈ [0, 100]
 * const a = 10
 * const b = rescale({ value: a, from: [0, 100], to: [0, 10] }) //=> 1
 */
export const rescale = (input: { value: number; from: Range; to: Range }) => {
  return (
    ((input.value - input.from[0]) * (input.to[1] - input.to[0])) /
      (input.from[1] - input.from[0]) +
    input.to[0]
  )
}
