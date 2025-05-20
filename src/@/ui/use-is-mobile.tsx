import { useEffect, useState } from 'react'

const MOBILE_MAX_WIDTH = 768

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_MAX_WIDTH)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile, {
      passive: true,
    })

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return isMobile
}
