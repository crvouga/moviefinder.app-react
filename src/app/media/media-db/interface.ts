export type IMediaDb = {
  query: () => Promise<IMedia[]>
}

export type IMedia = {
  id: string
  title: string
  description: string
}
