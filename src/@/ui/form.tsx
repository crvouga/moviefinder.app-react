import { ReactNode } from 'react'

export const Form = (props: {
  submitting: boolean
  onSubmit: () => void
  renderFields: (props: { disabled: boolean }) => ReactNode
  renderSubmit: (props: { loading: boolean }) => ReactNode
}) => {
  return (
    <form
      className="flex w-full flex-col gap-4 p-6"
      onSubmit={(e) => {
        e.preventDefault()
        props.onSubmit()
      }}
    >
      {props.renderFields({ disabled: props.submitting })}
      <div className="flex w-full py-1"></div>
      {props.renderSubmit({ loading: props.submitting })}
    </form>
  )
}
