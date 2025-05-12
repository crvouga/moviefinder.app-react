import { MemoryFS, PGlite } from '@electric-sql/pglite'
import { live } from '@electric-sql/pglite/live'
import { Pglite } from './pglite'

let pglite: Pglite | undefined
export const createPgliteTestEnv = async () => {
  if (pglite) {
    return pglite
  }

  pglite = await PGlite.create({
    extensions: { live },
    fs: new MemoryFS(),
    relaxedDurability: true,
  })

  return pglite
}
