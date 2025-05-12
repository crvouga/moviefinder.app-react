import { IdbFs, MemoryFS, PGlite } from '@electric-sql/pglite'
import { live } from '@electric-sql/pglite/live'

export type PgliteConfig =
  | {
      t: 'in-memory'
    }
  | {
      t: 'indexed-db'
      databaseName: string
    }

const configToFs = (config: PgliteConfig) => {
  switch (config.t) {
    case 'in-memory':
      return new MemoryFS()
    case 'indexed-db':
      return new IdbFs(config.databaseName)
  }
}
export const createPglite = async (config: PgliteConfig) => {
  const pglite = await PGlite.create({
    extensions: {
      live,
    },
    relaxedDurability: true,
    fs: configToFs(config),
  })

  return pglite
}

export type Pglite = Awaited<ReturnType<typeof createPglite>>
