import { IconArrowLeftSolid, IconEllipsisSolid } from './icon'
import { IconButton, IconButtonEmpty } from './icon-button'

export const TopBar = (props: { title: string; onBack?: () => void; onMore?: () => void }) => {
  return (
    <div className="flex h-16 w-full shrink-0 items-center justify-between px-2">
      {props.onBack ? (
        <IconButton
          onPointerDown={props.onBack}
          renderIcon={(props) => <IconArrowLeftSolid {...props} />}
        />
      ) : (
        <IconButtonEmpty />
      )}
      <div className="w-full flex-1 text-center text-lg font-bold">{props.title}</div>
      {props.onMore ? (
        <IconButton
          onPointerDown={props.onMore}
          renderIcon={(props) => <IconEllipsisSolid {...props} />}
        />
      ) : (
        <IconButtonEmpty />
      )}
    </div>
  )
}
