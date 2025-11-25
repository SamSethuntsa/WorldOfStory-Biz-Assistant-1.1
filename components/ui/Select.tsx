
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <select
        id={id}
        className="w-full bg-background border border-gray-700 rounded-md shadow-sm px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;