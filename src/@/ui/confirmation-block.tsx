import { Button } from './button'
import { Typography } from './typography'

export const ConfirmationBlock = (props: {
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  color: 'danger' | 'default'
}) => {
  return (
    <div className="flex w-full flex-col gap-8 p-6">
      <div className="flex w-full flex-col gap-4">
        <Typography text={props.title} variant="h2" />
        <Typography text={props.description} variant="p" />
      </div>
      <div className="flex w-full flex-row gap-4">
        <Button
          className="flex-1"
          text="Cancel"
          onClick={props.onCancel}
          variant="outlined"
          color="default"
        />
        <Button
          className="flex-1"
          text="Confirm"
          onClick={props.onConfirm}
          variant="contained"
          color={props.color}
        />
      </div>
    </div>
  )
}
