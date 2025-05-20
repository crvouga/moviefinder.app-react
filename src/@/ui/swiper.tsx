// @ts-nocheck
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { register } from 'swiper/element/bundle'
register()

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'swiper-container': React.HTMLAttributes<HTMLElement>
      'swiper-wrapper': React.HTMLAttributes<HTMLElement>
      'swiper-slide': React.HTMLAttributes<HTMLElement>
      'swiper-button-prev': React.HTMLAttributes<HTMLElement>
      'swiper-button-next': React.HTMLAttributes<HTMLElement>
      'swiper-pagination': React.HTMLAttributes<HTMLElement>
      'swiper-scrollbar': React.HTMLAttributes<HTMLElement>
    }
  }
}

export type SwiperContainerProps = {
  children: React.ReactNode
  className?: string
  navigation?: boolean
  pagination?: boolean | { type: string } // Allow object config
  slidesPerView?: number | 'auto'
  spaceBetween?: number
  loop?: boolean
  direction?: 'horizontal' | 'vertical'
  // Add other Swiper options as needed, mirroring the IntrinsicElements definition
  autoplay?: boolean | { delay?: number; disableOnInteraction?: boolean }
  speed?: number
  initialSlide?: number
  centeredSlides?: boolean
  cssMode?: boolean
  grabCursor?: boolean
  effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip'
  onSlideChange?: (input: { activeSlideIndex: number; data: unknown }) => void
  slidesOffsetAfter?: number
  slidesOffsetBefore?: number
  slideRestorationKey?: string
  cssMode?: boolean
}

const activeIndexBy = new Map<string, number>()

const Container = (props: SwiperContainerProps) => {
  const ref = useRef<HTMLElement>()

  useSwiperSlideChange(ref, props)
  useSlideRestoration(ref, props)
  useCssModeSlidesOffsets(ref, props)
  return (
    <swiper-container
      ref={ref}
      direction={props.direction}
      class={props.className}
      slides-per-view={props.slidesPerView}
      space-between={props.spaceBetween}
      loop={props.loop}
      navigation={props.navigation}
      pagination={props.pagination}
      initial-slide={props.initialSlide}
      slides-offset-after={props.slidesOffsetAfter}
      slides-offset-before={props.slidesOffsetBefore}
      css-mode={props.cssMode}
      key={props.cssMode}
    >
      {props.children}
    </swiper-container>
  )
}

const useCssModeSlidesOffsets = (
  ref: React.RefObject<HTMLElement>,
  props: SwiperContainerProps
) => {
  useLayoutEffect(() => {
    if (!ref.current || !props.cssMode) return

    const container = ref.current
    const slides = container.querySelectorAll('swiper-slide')

    if (slides.length === 0) return

    if (props.slidesOffsetBefore) {
      slides[0].style.paddingLeft = `${props.slidesOffsetBefore}px`
    }
    if (props.slidesOffsetAfter) {
      slides[slides.length - 1].style.paddingRight = `${props.slidesOffsetAfter}px`
    }
  }, [props])
}

const slideRestorationCache = new Map<string, number>()

const useSlideRestoration = (ref: React.RefObject<HTMLElement>, props: SwiperContainerProps) => {
  useEffect(() => {
    if (!ref.current) return

    const activeIndex = slideRestorationCache.get(props.slideRestorationKey)

    if (typeof activeIndex !== 'number') return

    ref.current.swiper.slideTo(activeIndex, 0)
  }, [])
}

const useSwiperSlideChange = (ref: React.RefObject<HTMLElement>, props: SwiperContainerProps) => {
  useEffect(() => {
    if (!ref.current) return

    const onSlideChange = (event: CustomEvent) => {
      const [swiper] = event.detail
      const maybeActiveIndex = swiper.activeIndex
      const activeIndex = typeof maybeActiveIndex === 'number' ? maybeActiveIndex : 0
      const swiperSlide = swiper?.slides?.[activeIndex]
      const slideData = swiperSlide?.getAttribute?.('data')
      const data = slideData ? decodeData(slideData) : undefined
      props.onSlideChange?.({ activeSlideIndex: activeIndex, data })

      slideRestorationCache.set(props.slideRestorationKey, activeIndex)
    }
    ref.current?.addEventListener('swiperslidechange', onSlideChange)
    return () => {
      ref.current?.removeEventListener('swiperslidechange', onSlideChange)
    }
  }, [])
}

const Slide = (props: { children: React.ReactNode; className?: string; data?: unknown }) => {
  return (
    <swiper-slide className={props.className} data={encodeData(props.data)}>
      {props.children}
    </swiper-slide>
  )
}
const encodeData = (data: unknown) => {
  if (!data) {
    return ''
  }
  return btoa(JSON.stringify(data))
}
const decodeData = (data: unknown): unknown => {
  try {
    if (typeof data === 'string') {
      const decoded = atob(data)
      return JSON.parse(decoded)
    }
  } catch (_error) {
    // ignore
  }
  return {}
}

export const Swiper = {
  Container,
  Slide,
}
