
import React from 'react';
import { InputConfig } from '../types';

interface CalculatorInputProps {
  config: InputConfig;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
}

const CalculatorInput: React.FC<CalculatorInputProps> = ({ config, value, onChange, error }) => {
  return (
    <div className="mb-4">
      <label htmlFor={config.name} className="block text-sm font-medium text-gray-700 mb-1">
        {config.label} {config.unit && <span className="text-xs text-gray-500">({config.unit})</span>}
      </label>
      {config.type === 'select' && config.options ? (
        <select
          id={config.name}
          name={config.name}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          aria-label={config.label}
        >
          {config.options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={config.type}
          id={config.name}
          name={config.name}
          value={value}
          onChange={onChange}
          placeholder={config.placeholder || `Insira ${config.label.toLowerCase()}`}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          aria-label={config.label}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-500" role="alert">{error}</p>}
    </div>
  );
};

export default CalculatorInput;
