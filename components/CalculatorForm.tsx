import React from 'react';
import type { MortgageInputs } from '../types';
import { Input } from './Input';
import { StepperInput } from './StepperInput';

interface CalculatorFormProps {
  inputs: MortgageInputs;
  setInputs: React.Dispatch<React.SetStateAction<MortgageInputs>>;
  error: string | null;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ inputs, setInputs, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleStepperChange = (name: string, value: number) => {
    setInputs(prev => ({ ...prev, [name]: String(value) }));
  };

  return (
    <div className="p-5 sm:p-8 md:p-12 lg:p-16 bg-white">
      <div className="mb-6 md:mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-dark-text tracking-tight">Mortgage Overpayment Calculator</h1>
        <p className="text-slate-500 mt-3 text-base md:text-lg">Work out how much you could save by paying extra.</p>
      </div>

      <form className="space-y-6 md:space-y-8">
          <h2 className="text-xl md:text-2xl font-bold text-dark-text">Your details</h2>
          <div className="space-y-4 md:space-y-6">
            <Input
              label="Mortgage Amount"
              name="amount"
              value={inputs.amount}
              onChange={handleChange}
              min="0"
            />
            <StepperInput
              label="Mortgage Term"
              name="term"
              value={Number(inputs.term)}
              onChange={handleStepperChange}
              step={1}
              min={1}
              max={50}
              suffix="years"
            />
            <StepperInput
              label="Interest Rate"
              name="rate"
              value={Number(inputs.rate)}
              onChange={handleStepperChange}
              step={0.1}
              min={0.1}
              max={25}
              precision={2}
              suffix="%"
            />
             <StepperInput
              label="Monthly Overpayment"
              name="monthlyOverpayment"
              value={Number(inputs.monthlyOverpayment)}
              onChange={handleStepperChange}
              step={10}
              min={0}
              prefix="£"
            />
            <StepperInput
              label="Lump Sum Overpayment"
              name="lumpSum"
              value={Number(inputs.lumpSum)}
              onChange={handleStepperChange}
              step={100}
              min={0}
              prefix="£"
            />
          </div>

        {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg text-sm">{error}</div>}

      </form>
    </div>
  );
};