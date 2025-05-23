import { forwardRef } from 'react'
import { Img } from '~/@/ui/img'

export const ImgLoading = forwardRef<HTMLDivElement | HTMLImageElement>((_props, ref) => {
  return <Img className="h-full w-full object-cover" alt="Loading..." ref={ref} />
})
