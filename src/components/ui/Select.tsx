import React from 'react';
import clsx from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  success?: boolean;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  success,
  options,
  className,
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-200">
          {label}
        </label>
      )}
      <select
        className={clsx(
          'w-full px-3 py-2 bg-gray-800 border rounded-lg text-white',
          'focus:outline-none focus:ring-2 transition-colors duration-200',
          {
            'border-gray-600 focus:ring-blue-500 focus:border-blue-500': !error && !success,
            'border-red-500 focus:ring-red-500 focus:border-red-500': error,
            'border-green-500 focus:ring-green-500 focus:border-green-500': success && !error,
          },
          className
        )}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};