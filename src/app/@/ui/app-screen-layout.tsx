import { useRef } from 'react'
import { TimeSpan } from '~/@/time-span'
import { BottomButton, BottomButtons } from '~/@/ui/bottom-buttons'
import { TopBar } from '~/@/ui/top-bar'
import { useScrollRestoration } from '~/@/ui/use-scroll-restoration'
import { AppVideoPlayer } from '~/app/@/ui/app-video-player'
import { useAppBottomButtons } from './app-bottom-buttons'

export const AppScreenLayout = (props: {
  topBar: {
    title: string
    onBack?: () => void
    onMore?: () => void
  }
  actions?: BottomButton[]
  children: React.ReactNode
  includeAppBottomButtons?: boolean
  includeGutter?: boolean
  scrollKey: string
}) => {
  const appBottomButtons = useAppBottomButtons()
  const scrollableRef = useRef<HTMLDivElement>(null)
  useScrollRestoration({
    scrollableRef: scrollableRef as React.RefObject<HTMLElement>,
    scrollKey: props.scrollKey,
    delay: TimeSpan.milliseconds(0),
  })
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center overflow-hidden">
      <TopBar
        onBack={props.topBar.onBack}
        title={props.topBar.title}
        onMore={props.topBar.onMore}
      />

      <div className="relative flex w-full flex-1 overflow-hidden">
        <div
          ref={scrollableRef}
          className="flex w-full flex-1 flex-col items-center justify-start overflow-x-hidden overflow-y-auto"
          key={props.scrollKey}
        >
          {props.children}
        </div>
        <AppVideoPlayer />
      </div>

      {props.actions && props.actions.length > 0 && <BottomButtons buttons={props.actions} />}

      {props.includeAppBottomButtons && <BottomButtons buttons={appBottomButtons} />}
    </div>
  )
}
