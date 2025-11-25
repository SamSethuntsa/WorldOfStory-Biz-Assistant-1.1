
import React from 'react';
import { View, BusinessProfile } from '../types';
import { NAVIGATION_ITEMS } from '../constants';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isOpen: boolean;
  businessProfile: BusinessProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, businessProfile }) => {
  return (
    <aside 
        className={`
            fixed inset-y-0 left-0 z-30 w-64 bg-surface flex-shrink-0 flex flex-col p-4 space-y-8
            transform transition-transform duration-300 ease-in-out border-r border-gray-800
            md:relative md:translate-x-0 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
    >
        <div className="flex items-center space-x-3 px-2 pt-2 overflow-hidden">
           <div className="flex-shrink-0">
               {businessProfile.logo ? (
                   <div className="h-10 w-10 rounded-lg bg-white/10 p-1 flex items-center justify-center overflow-hidden">
                       <img src={businessProfile.logo} alt="Logo" className="w-full h-full object-contain grayscale" />
                   </div>
               ) : (
                    <div className="bg-white text-black p-2 rounded-lg">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
               )}
           </div>
           <h1 className="text-xl font-bold text-white truncate" title={businessProfile.name || "Biz Assistant"}>
              {businessProfile.name || (
                  <>Biz <span className="text-gray-400">Assistant</span></>
              )}
            </h1>
        </div>
        
      <nav className="flex flex-col space-y-2 flex-grow overflow-y-auto">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 w-full text-left ${
              currentView === item.id
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {React.cloneElement(item.icon, { className: 'h-5 w-5' })}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="px-2 pb-2">
          <p className="text-xs text-gray-600 text-center">Version 1.2 Monochrome</p>
      </div>
    </aside>
  );
};

export default Sidebar;