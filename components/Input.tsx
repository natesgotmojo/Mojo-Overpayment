import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({ label, value, onChange, name, ...props }) => {
  
  const formatNumber = (numStr: string) => {
    if (!numStr) return '';
    // Return formatted number, or empty string if input is not a valid number
    const number = parseInt(numStr.replace(/,/g, ''), 10);
    return isNaN(number) ? '' : number.toLocaleString('en-GB');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-digit characters to get the raw number for state
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    
    // Create a synthetic event to pass to the parent handler
    const syntheticEvent = {
      target: {
        name: name || '',
        value: rawValue,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  const formattedValue = formatNumber(value);

  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative border-b border-slate-300 focus-within:border-mojo-blue transition duration-150">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
          <span className="text-dark-text text-lg">£</span>
        </div>
        <input
          type="text"
          inputMode="numeric"
          id={name}
          name={name}
          className="block w-full bg-transparent border-0 py-2 px-5 text-dark-text text-lg text-center focus:ring-0"
          value={formattedValue}
          onChange={handleInputChange}
          placeholder="250,000"
          {...props}
        />
      </div>
    </div>
  );
};
