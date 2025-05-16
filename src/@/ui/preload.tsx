import { WrapIntersectionObserver } from './intersection-observer'

const alreadyPreloaded = new Set<string>()

export const WithPreload = (props: {
  children: React.ReactNode
  onPreload: () => void
  preloadKey: string
  className?: string
}) => {
  return (
    <WrapIntersectionObserver
      onVisible={() => {
        if (alreadyPreloaded.has(props.preloadKey)) {
          return
        }
        alreadyPreloaded.add(props.preloadKey)
        props.onPreload()
      }}
    >
      {props.children}
    </WrapIntersectionObserver>
  )
}
