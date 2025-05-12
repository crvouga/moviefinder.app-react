export const cn = (...classes: (string | undefined | null | boolean | number)[]) => {
  return classes.filter(Boolean).join(' ')
}
