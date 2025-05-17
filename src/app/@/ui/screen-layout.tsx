import { useRef } from 'react'
import { TimeSpan } from '~/@/time-span'
import { BottomButton, BottomButtons } from '~/@/ui/bottom-buttons'
import { useScrollRestoration } from '~/@/ui/scroll-restoration'
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
  scrollKey?: string
}) => {
  const appBottomButtons = useAppBottomButtons()
  const scrollableRef = useRef<HTMLDivElement>(null)
  useScrollRestoration({
    scrollableRef: scrollableRef as React.RefObject<HTMLElement>,
    scrollKey: props.scrollKey ?? '',
    delay: TimeSpan.milliseconds(0),
  })
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center overflow-hidden">
      <TopBar onBack={props.topBar.onBack} title={props.topBar.title} />

      <div
        ref={scrollableRef}
        key={props.scrollKey}
        className="flex w-full flex-1 flex-col items-center justify-start overflow-x-hidden overflow-y-auto"
      >
        {props.children}
      </div>

      {props.actions && props.actions.length > 0 && <BottomButtons buttons={props.actions} />}

      {props.includeAppBottomButtons && <BottomButtons buttons={appBottomButtons} />}
    </div>
  )
}
