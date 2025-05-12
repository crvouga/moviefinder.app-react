export const exhaustive = (_value: never) => {
  throw new Error('Exhaustive check failed')
}
