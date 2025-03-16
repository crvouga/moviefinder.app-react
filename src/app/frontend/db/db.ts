export type Db = {
  entities: {
    users: {
      [key: string]: {
        name: string
        email: string
      }
    }
    media: {
      [key: string]: {
        title: string
        description: string
        image: string
        video: string
      }
    }
    lists: {
      [key: string]: {
        name: string
        description: string
        media: string[]
      }
    }
    comments: {
      [key: string]: {
        content: string
        media: string[]
      }
    }
  }
  indexes: {
    usersByEmail: {
      [email: string]: string
    }
    mediaByTitle: {
      [title: string]: string
    }
    listsByMedia: {
      [media: string]: string[]
    }
    commentsByMedia: {
      [media: string]: string[]
    }
  }
}
