import { BottomButton, BottomButtons } from '~/@/ui/bottom-buttons'
import { TopBar } from '~/@/ui/top-bar'

export const ScreenLayout = (props: {
  topBar: {
    title: string
    onBack?: () => void
  }
  actions: BottomButton[]
  children: React.ReactNode
}) => {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center overflow-hidden">
      <TopBar onBack={props.topBar.onBack} title={props.topBar.title} />
      <div className="flex w-full flex-1 flex-col items-center justify-center overflow-hidden">
        {props.children}
      </div>
      {props.actions.length > 0 && <BottomButtons buttons={props.actions} />}
    </div>
  )
}
