import React from 'react';

interface CardProps {
  title: string;
  value: string;
  // FIX: Explicitly define that the icon element accepts a className prop to satisfy React.cloneElement type checking.
  icon: React.ReactElement<{ className?: string }>;
  details?: string;
  color?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, value, icon, details, color = 'text-white', children }) => {
  return (
    <div className="bg-surface p-5 rounded-xl shadow-lg flex flex-col h-full">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="bg-gray-800 p-3 rounded-lg">
             {React.cloneElement(icon, { className: 'h-6 w-6 text-gray-400' })}
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</h4>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          {details && <p className="text-xs text-gray-500 mt-1">{details}</p>}
        </div>
      </div>
       {children && <div className="mt-4 flex-grow">{children}</div>}
    </div>
  );
};

export default Card;