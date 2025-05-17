import { IPgliteInstance, PgliteConfig } from './types'

export const PgliteInstance = async (config: PgliteConfig): Promise<IPgliteInstance> => {
  const { PGlite, MemoryFS, IdbFs } = await import('@electric-sql/pglite')
  const { live } = await import('@electric-sql/pglite/live')

  const configToFs = (config: PgliteConfig) => {
    switch (config.t) {
      case 'in-memory':
        return new MemoryFS()
      case 'indexed-db':
        return new IdbFs(config.databaseName)
    }
  }

  const pglite = await PGlite.create({
    extensions: {
      live,
    },
    relaxedDurability: true,
    fs: configToFs(config),
  })

  return pglite
}
