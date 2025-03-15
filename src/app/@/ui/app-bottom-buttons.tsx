import { BottomButtons } from '~/@/ui/bottom-buttons';
import { IconHomeSolid } from '~/@/ui/icon/home/solid';
import { IconUserCircleSolid } from '~/@/ui/icon/user-circle/solid';
import { useCurrentScreen } from '../screen/use-current-screen';

export const AppBottomButtons = () => {
  const currentScreen = useCurrentScreen();
  return (
    <BottomButtons
      buttons={[
        {
          icon: (props) => <IconHomeSolid {...props} />,
          label: 'Home',
          selected: currentScreen.value.type === 'home',
          onClick: () => currentScreen.push({ type: 'home' }),
        },
        {
          icon: (props) => <IconUserCircleSolid {...props} />,
          label: 'Account',
          selected: currentScreen.value.type === 'account',
          onClick: () => currentScreen.push({ type: 'account' }),
        },
      ]}
    />
  );
};

export const AppBottomButtonsLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center">
      <div className="w-full flex-1 flex-col items-center justify-center">{props.children}</div>
      <AppBottomButtons />
    </div>
  );
};
