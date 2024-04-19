import React from 'react';
import SavingsActions from './savingsActions';

interface ProgressBarsProps {
  sx: any;
  description: string;
  present_amount: number;
  id_sav: number;
  target_amount: number;
  onDelete: (id: number, amount: number) => Promise<void>;
  onAdd: (id: number, presentAmount: number, targetAmount: number) => Promise<void>;
  onTake: (id: number, presentAmount: number, targetAmount: number) => Promise<void>;
}

const ProgressBars = (props: ProgressBarsProps) => {
  const { sx, description, present_amount, id_sav, target_amount, onDelete, onAdd, onTake } = props;

  // Calculate progress percentage
  const progress = (present_amount / target_amount) * 100 || 0;

  return (
    <div className="max-w-screen-lg mx-auto relative" style={sx}>
      <div className="h-8 text-black w-auto text-xl my-3">Saving's progress:</div>
      <div className="flex w-auto text-xl mt-3">{description}</div>
      <div className="flex w-auto text-xl mt-3">{`Present Amount: ${present_amount}`}</div>
      <div className="flex w-auto text-xl mt-3">{`Target Amount: ${target_amount}`}</div>
      <div className="relative bg-gray-200 rounded-full h-10">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-green-500 z-0"
          style={{ width: `${progress}%`}}
        ></div>
        <div className="flex items-center justify-center h-full text-black font-bold absolute top-0 left-0 right-0 z-10">
          {`${progress}%`}
        </div>
      </div>
      <div className="absolute top-0 right-0 p-4">
        <SavingsActions
          onDelete={onDelete}
          onAdd={onAdd}
          onTake={onTake}
          savingId={id_sav}
          savingPresentAmount={present_amount}
          savingTargetAmount={target_amount}
        />
      </div>
    </div>
  );
};

export default ProgressBars;
