// @ts-nocheck
import React, { useLayoutEffect, useRef } from 'react'
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
  slideRestoration?: {
    enabled: boolean
    key: string
  }
}

const activeIndexBy = new Map<string, number>()

const Container = (props: SwiperContainerProps) => {
  const ref = useRef<HTMLElement>()

  useLayoutEffect(() => {
    if (!ref.current) {
      return
    }

    Object.assign(ref.current.dataset, {
      slidesPerView: props.slidesPerView,
      spaceBetween: props.spaceBetween,
      loop: props.loop,
      navigation: props.navigation,
      direction: props.direction,
      pagination: props.pagination,
      slidesOffsetAfter: props.slidesOffsetAfter,
      slidesOffsetBefore: props.slidesOffsetBefore,
      initialSlide:
        props.initialSlide ||
        (props.slideRestoration?.enabled && activeIndexBy.get(props.slideRestoration.key)),
    })
  }, [props.slidesPerView, props.spaceBetween, props.loop, props.navigation, props.pagination])

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
    >
      {props.children}
    </swiper-container>
  )
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
