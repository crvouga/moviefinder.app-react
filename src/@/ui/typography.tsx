import { cn } from './cn'

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'label'
  | 'caption'

export type TypographyProps = {
  variant: TypographyVariant
  text?: string
  skeleton?: boolean
  skeletonLength?: number
  className?: string
  color?: 'primary' | 'secondary' | 'tertiary' | 'quaternary'
}

const SKELETON_CHAR = 'S '

export const Typography = (props: TypographyProps) => {
  return (
    <p
      className={cn(
        props.className,
        props.skeleton && 'animate-pulse rounded-lg bg-neutral-700 text-transparent select-none',
        props.variant === 'h1' && 'text-4xl font-bold',
        props.variant === 'h2' && 'text-3xl font-bold',
        props.variant === 'h3' && 'text-2xl font-bold',
        props.variant === 'h4' && 'text-xl font-bold',
        props.variant === 'h5' && 'text-lg font-bold',
        props.variant === 'h6' && 'text-base font-bold',
        props.variant === 'p' && 'text-base',
        props.variant === 'span' && 'text-base',
        props.variant === 'label' && 'text-sm',
        props.variant === 'caption' && 'text-xs',
        props.color === 'primary' && 'text-white',
        props.color === 'secondary' && 'text-neutral-400',
        props.color === 'tertiary' && 'text-neutral-500',
        props.color === 'quaternary' && 'text-neutral-600'
      )}
    >
      {props.skeleton ? SKELETON_CHAR.repeat(props.skeletonLength ?? 10) : props.text}
    </p>
  )
}
