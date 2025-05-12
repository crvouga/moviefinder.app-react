import { ILogger } from './logger'

const respond = async (input: {
  req: Request
  logger: ILogger
  distDir: string
  indexHtml: string
}): Promise<Response> => {
  const url = new URL(input.req.url)
  const path = url.pathname
  input.logger.info('Serving SPA', { path })

  const filePath = path === '/' ? `${input.distDir}/${input.indexHtml}` : `${input.distDir}${path}`
  input.logger.info('Looking for file', { filePath })

  const file = Bun.file(filePath)

  if (await file.exists()) {
    input.logger.info('Serving file', { filePath })
    return new Response(file)
  }

  input.logger.info('File not found, serving index', { filePath })
  const indexFile = Bun.file(`${input.distDir}/${input.indexHtml}`)

  if (await indexFile.exists()) {
    input.logger.info('Serving index', { filePath })
    return new Response(indexFile)
  }

  input.logger.error('Index file not found', { filePath })
  return new Response('Not found', { status: 404 })
}

export const ServeSinglePageApp = {
  respond,
}
