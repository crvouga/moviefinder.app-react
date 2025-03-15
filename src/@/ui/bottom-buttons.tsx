import { ReactNode } from 'react';

export type BottomButton = {
  label: string;
  icon: (props: { className: string }) => ReactNode;
  selected: boolean;
  onClick: () => void;
};

export type BottomButtonsProps = {
  buttons: BottomButton[];
};

export const BottomButtons = (props: BottomButtonsProps) => {
  return (
    <div className="flex w-full justify-around border-t">
      {props.buttons.map((button) => (
        <BottomButton key={button.label} button={button} />
      ))}
    </div>
  );
};

const BottomButton = ({ button }: { button: BottomButton }) => {
  return (
    <button
      onClick={button.onClick}
      className={`flex flex-col items-center p-2 ${
        button.selected ? 'text-blue-500' : 'text-gray-500'
      }`}
    >
      <span className="text-2xl">{button.icon({ className: 'size-6' })}</span>
      <span className="text-xs">{button.label}</span>
    </button>
  );
};
