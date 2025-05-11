// @ts-nocheck
import React, { useEffect, useRef } from 'react'
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

interface SwiperProps {
  children: React.ReactNode
  className?: string
  navigation?: boolean
  pagination?: boolean | { type: string } // Allow object config
  slidesPerView?: number | string
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
}

const Container = (props: SwiperProps) => {
  const ref = useRef<HTMLElement>()

  useEffect(() => {
    if (ref.current) {
      if (props.slidesPerView) {
        ref.current.setAttribute('slides-per-view', props.slidesPerView)
      }
      if (props.spaceBetween) {
        ref.current.setAttribute('space-between', props.spaceBetween)
      }
      if (props.loop) {
        ref.current.setAttribute('loop', props.loop)
      }
      if (props.navigation) {
        ref.current.setAttribute('navigation', props.navigation)
      }
      if (props.direction) {
        ref.current.setAttribute('direction', props.direction)
      }
      if (props.pagination) {
        ref.current.setAttribute('pagination', props.pagination)
      }
    }
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
    >
      {props.children}
    </swiper-container>
  )
}

const Slide = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return <swiper-slide className={className}>{children}</swiper-slide>
}

export const Swiper = {
  Container,
  Slide,
}
