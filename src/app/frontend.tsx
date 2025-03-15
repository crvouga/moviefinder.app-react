import { CurrentScreen } from './frontend/current-screen';

export const App = () => {
  return (
    <AppRoot>
      <CurrentScreen />
    </AppRoot>
  );
};

const AppRoot = (props: { children: React.ReactNode }) => {
  return (
    <div className="flex h-[100vh] w-screen items-center justify-center bg-black text-white">
      <div className="flex h-full max-h-[900px] w-full max-w-[600px] flex-col items-center justify-center rounded border">
        {props.children}
      </div>
    </div>
  );
};
