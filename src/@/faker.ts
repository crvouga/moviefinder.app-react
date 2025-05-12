export const createFaker = async () => {
  const { faker } = await import('@faker-js/faker')
  return faker
}
