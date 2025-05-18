import { useEffect } from 'react'

export const preloadImg = (images: string[]) => {
  for (const image of images) {
    const img = new Image()
    img.src = image
  }
}

export const PreloadImg = (props: { images?: string[] }) => {
  useEffect(() => {
    preloadImg(props.images ?? [])
  }, [props.images])
  return null
}
