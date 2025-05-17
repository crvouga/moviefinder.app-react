import { cn } from './cn'

type AvatarProps = {
  src?: string | null | undefined
  alt?: string | null | undefined
  className?: string
  onClick?: () => void
  skeleton?: boolean
}

const isImage = (src: string | null | undefined): boolean => {
  return typeof src === 'string' && src.startsWith('http')
}

export const Avatar = (props: AvatarProps) => {
  if (props.skeleton) {
    return (
      <div
        className={cn(
          'aspect-square size-24 animate-pulse rounded-full bg-neutral-700',
          props.className
        )}
      />
    )
  }

  if (isImage(props.src)) {
    return (
      <img
        onClick={props.onClick}
        src={props.src ?? ''}
        alt={props.alt ?? 'user avatar'}
        className={cn(
          'inline-block aspect-square flex-shrink-0 overflow-hidden rounded-full bg-white/40 object-cover',
          props.className
        )}
      />
    )
  }

  return (
    <span
      onClick={props.onClick}
      className={cn(
        'inline-block aspect-square flex-shrink-0 overflow-hidden rounded-full bg-white/40',
        props.className
      )}
    >
      <svg className="h-full w-full text-neutral-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </span>
  )
}
