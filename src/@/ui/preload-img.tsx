import { useEffect } from 'react'

export const PreloadImg = (props: { image?: string }) => {
  useEffect(() => {
    if (!props.image) {
      return
    }
    const img = new Image()
    img.src = props.image
  }, [props.image])
  return null
}
