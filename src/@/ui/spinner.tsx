import { cn } from './cn'

export const SPINNER_TEST_ID = 'spinner'

export const IconSpinner = (input: { className?: string; 'aria-label': string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...input}
    >
      <title>{input['aria-label']}</title>
      <path
        fillRule="evenodd"
        d="M12 19a7 7 0 100-14 7 7 0 000 14zm0 3c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
        clipRule="evenodd"
        opacity="0.2"
      />
      <path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 00-7 7H2z" />
    </svg>
  )
}

export const Spinner = (input: { className?: string }) => {
  return (
    <IconSpinner
      aria-label="Loading..."
      data-testid={SPINNER_TEST_ID}
      className={cn('animate-spin', input.className ? input.className : 'size-16')}
    />
  )
}

export const SpinnerBlock = (input: { className?: string }) => {
  return (
    <div className={cn('flex w-full flex-1 flex-col items-center justify-center', input.className)}>
      <Spinner />
    </div>
  )
}
