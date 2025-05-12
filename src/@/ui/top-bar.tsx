import { IconButton, IconButtonEmpty } from './icon-button'
import { IconArrowLeftSolid } from './icon/arrow-left/solid'

export const TopBar = (props: { title: string; onBack?: () => void }) => {
  return (
    <div className="flex h-16 w-full items-center justify-between px-2">
      {props.onBack ? (
        <IconButton
          onClick={props.onBack}
          renderIcon={(props) => <IconArrowLeftSolid {...props} />}
        />
      ) : (
        <IconButtonEmpty />
      )}
      <div className="w-full flex-1 text-center text-lg font-bold">{props.title}</div>
      <IconButtonEmpty />
    </div>
  )
}
