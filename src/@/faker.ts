export const createFaker = async () => {
  const { faker } = await import('@faker-js/faker/locale/en')
  return faker
}
