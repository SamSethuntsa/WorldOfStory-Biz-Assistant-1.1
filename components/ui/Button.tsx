import React from 'react';

// FIX: Add 'size' prop to allow for different button sizes.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  // FIX: Removed padding from baseClasses to be handled by size-specific classes.
  const baseClasses = "rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2";
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
  };

  const variantClasses = {
    primary: 'bg-white text-black hover:bg-gray-200 focus:ring-white',
    secondary: 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-600',
    danger: 'bg-transparent border border-gray-600 text-gray-400 hover:text-white hover:border-white focus:ring-gray-600',
  };

  return (
    <button className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;