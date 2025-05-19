import { ReactNode } from 'react'
import { cn } from './cn'
import { IconXMarkSolid } from './icon'

export const TextField = (input: {
  startIcon?: ReactNode
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'
  autoFocus?: boolean
  id: string
  label: string
  value: string | number
  error?: boolean
  helperText?: string | null
  min?: number
  max?: number
  step?: number
  onClear?: () => void
  onChange: (value: string) => void
  disabled?: boolean
  required?: boolean
}) => {
  return (
    <label className="flex w-full flex-col gap-1">
      <label htmlFor={input.id} className={cn('text-base', input.error && 'text-red-500')}>
        {input.label}
      </label>

      <div
        className={cn(
          'flex h-fit w-full flex-row overflow-hidden rounded-md border-2 bg-neutral-800',
          input.error && 'border-2 border-red-500 text-red-500',
          !input.error && 'ring-blue-600 focus-within:ring-2',
          input.disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input
          role="textbox"
          aria-label={input.label}
          id={input.id}
          autoFocus={input.autoFocus}
          type={input.type}
          min={input.min}
          max={input.max}
          auto-complete="off"
          auto-capitalize="off"
          auto-correct="off"
          auto-save="off"
          step={input.step}
          required={input.required}
          disabled={input.disabled}
          // Controlled inputs are bugging out in React and Inferno. The cursor jumps to the end of the input on every change.
          // value={input.value}
          defaultValue={input.value}
          onInput={(e) => {
            e.preventDefault()
            if (!input.disabled) {
              input.onChange(e.currentTarget.value)
            }
          }}
          className={cn(
            'flex flex-1 appearance-none items-center gap-2 bg-transparent p-3 py-4 text-xl outline-none',
            input.disabled && 'cursor-not-allowed'
          )}
          style={{
            background: 'transparent !important',
          }}
        />
        {input.onClear && input.value && input.value?.toString().length > 0 && !input.disabled && (
          <button
            className="rounded-md px-3 ring-blue-600 outline-none focus:ring-2"
            aria-label="Clear input"
            type="button"
            onClick={(e) => {
              e.preventDefault()
              const self = document.getElementById(input.id)
              if (self instanceof HTMLInputElement) {
                self.focus()
                self.value = ''
              }
              input.onClear?.()
            }}
          >
            <IconXMarkSolid className="size-6" />
          </button>
        )}
      </div>

      {input.helperText && (
        <div className={cn('text-sm', input.error && 'text-red-500')}>{input.helperText}</div>
      )}
    </label>
  )
}
