import { PGlite } from '@electric-sql/pglite'
import { live } from '@electric-sql/pglite/live'

export const createPglite = async (): Promise<PGlite> => {
  const pglite = await PGlite.create({
    extensions: {
      live,
    },
  })

  return pglite
}
