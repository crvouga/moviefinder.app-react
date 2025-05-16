import { BottomButton, BottomButtons } from '~/@/ui/bottom-buttons'
import { TopBar } from '~/@/ui/top-bar'
import { useAppBottomButtons } from './app-bottom-buttons'

export const ScreenLayout = (props: {
  topBar: {
    title: string
    onBack?: () => void
  }
  actions?: BottomButton[]
  children: React.ReactNode
  includeAppBottomButtons?: boolean
  includeGutter?: boolean
}) => {
  const appBottomButtons = useAppBottomButtons()
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center overflow-hidden">
      <TopBar onBack={props.topBar.onBack} title={props.topBar.title} />

      <div className="flex w-full flex-1 flex-col items-center justify-start overflow-hidden">
        {props.children}
      </div>

      {props.actions && props.actions.length > 0 && <BottomButtons buttons={props.actions} />}

      {props.includeAppBottomButtons && <BottomButtons buttons={appBottomButtons} />}
    </div>
  )
}
