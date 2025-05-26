import { useSyncExternalStore } from 'react'
import { Button } from '~/@/ui/button'
import { Store } from '~/@/ui/store'
import { YoutubeVideoPlayer } from '~/@/youtube/youtube-video-player'
import { Video } from '../../media/video/video'

export type State =
  | {
      t: 'closed'
    }
  | {
      t: 'opened'
      video: Video
    }

const store = Store<State>({ t: 'closed' })

export const AppVideoPlayer = () => {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot)

  if (state.t === 'closed') return null

  return (
    <div className="absolute top-0 right-0 left-0 z-30">
      <div className="overflow-bidden aspect-video w-full bg-black">
        {state.video.key ? <YoutubeVideoPlayer youtubeVideoKey={state.video.key} /> : null}
      </div>

      <div className="flex flex-row justify-end gap-2 px-2 py-1">
        {false && (
          <Button
            text="Minimize"
            color="primary"
            variant="contained"
            size="sm"
            onClick={() => store.update(() => ({ t: 'closed' }))}
          />
        )}
        <Button
          text="Close"
          color="primary"
          variant="contained"
          size="sm"
          onClick={() => store.update(() => ({ t: 'closed' }))}
        />
      </div>
    </div>
  )
}

export const useAppVideoPlayer = () => {
  const open = (video: Video) => {
    store.update(() => ({ t: 'opened', video }))
  }

  const toggle = (video: Video) => {
    store.update((prev) => {
      switch (prev.t) {
        case 'closed': {
          return { t: 'opened', video }
        }
        case 'opened': {
          if (prev.video.id === video.id) {
            return { t: 'closed' }
          }
          return { t: 'opened', video }
        }
      }
    })
  }

  return {
    open,
    toggle,
  }
}
