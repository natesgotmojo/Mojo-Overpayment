import React, { useState, useEffect } from 'react';
import { MinusIcon } from './icons/MinusIcon';
import { PlusIcon } from './icons/PlusIcon';

interface StepperInputProps {
  label: string;
  name: string;
  value: number;
  onChange: (name: string, value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  precision?: number;
  prefix?: string;
  suffix?: string;
}

const formatValue = (value: number, precision: number, includeSeparators: boolean = true) => {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    useGrouping: includeSeparators,
  };
  return new Intl.NumberFormat('en-GB', options).format(value);
};


export const StepperInput: React.FC<StepperInputProps> = ({
  label,
  name,
  value,
  onChange,
  step = 1,
  min = -Infinity,
  max = Infinity,
  precision = 0,
  prefix = '',
  suffix = ''
}) => {
  const [displayValue, setDisplayValue] = useState(formatValue(value, precision));

  useEffect(() => {
    // Update display value only if it's different from the formatted prop value
    // This avoids reformatting while the user is typing
    if (parseFloat(displayValue.replace(/,/g, '')) !== value) {
      setDisplayValue(formatValue(value, precision));
    }
  }, [value, precision]);

  const handleStep = (direction: 'increment' | 'decrement') => {
    let newValue = direction === 'increment' ? value + step : value - step;
    
    const factor = Math.pow(10, precision);
    newValue = Math.round(newValue * factor) / factor;

    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    
    onChange(name, newValue);
    setDisplayValue(formatValue(newValue, precision));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow digits, one decimal point, and commas for display
    const sanitized = inputValue.replace(/[^0-9.]/g, '');
    setDisplayValue(sanitized);

    const numericValue = parseFloat(sanitized);
    if (!isNaN(numericValue)) {
      onChange(name, numericValue);
    } else if (sanitized === '') {
      onChange(name, 0);
    }
  };

  const handleBlur = () => {
    let numericValue = parseFloat(displayValue.replace(/,/g, ''));
    if (isNaN(numericValue)) numericValue = min > 0 ? min : 0;
    
    if (numericValue < min) numericValue = min;
    if (numericValue > max) numericValue = max;

    onChange(name, numericValue);
    setDisplayValue(formatValue(numericValue, precision));
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <div className="flex items-center justify-between border border-slate-300 rounded-lg overflow-hidden h-14 focus-within:border-mojo-blue focus-within:ring-1 focus-within:ring-mojo-blue transition-all duration-150">
        <button
          type="button"
          onClick={() => handleStep('decrement')}
          className="w-12 sm:w-auto px-0 sm:px-6 h-full bg-stepper-minus text-white hover:bg-opacity-90 transition-colors duration-150 flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
        >
          <MinusIcon />
        </button>
        <div className="relative flex-grow h-full min-w-0">
          {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm sm:text-base">{prefix}</span>}
          <input
            type="text"
            inputMode={precision > 0 ? "decimal" : "numeric"}
            value={displayValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-full h-full bg-transparent border-0 text-base sm:text-lg font-semibold text-dark-text text-center focus:ring-0 px-8 sm:px-12 truncate"
            aria-label={label}
          />
          {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm sm:text-base">{suffix}</span>}
        </div>
        <button
          type="button"
          onClick={() => handleStep('increment')}
          className="w-12 sm:w-auto px-0 sm:px-6 h-full bg-stepper-plus text-white hover:bg-opacity-90 transition-colors duration-150 flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
};