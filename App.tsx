
import React, { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { View, Client, Project, Transaction, BusinessProfile, ReviewPlatform } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Projects from './components/Projects';
import Transactions from './components/Transactions';
import Assistant from './components/Assistant';
import Tax from './components/Tax';
import Landing from './components/Landing';
import Settings from './components/Settings';
import Reviews from './components/Reviews';
import Community from './components/Community';
import { ICONS, DEFAULT_REVIEW_PLATFORMS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Data State
  const [businessProfile, setBusinessProfile] = useLocalStorage<BusinessProfile>('biz-assistant-profile', { name: '' });
  const [clients, setClients] = useLocalStorage<Client[]>('biz-assistant-clients', []);
  const [projects, setProjects] = useLocalStorage<Project[]>('biz-assistant-projects', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('biz-assistant-transactions', []);
  const [reviewPlatforms, setReviewPlatforms] = useLocalStorage<ReviewPlatform[]>('biz-assistant-reviews', DEFAULT_REVIEW_PLATFORMS);


  const clientMap = useMemo(() => {
    return new Map(clients.map(client => [client.id, client.name]));
  }, [clients]);

  const projectMap = useMemo(() => {
    return new Map(projects.map(project => [project.id, project.name]));
  }, [projects]);


  const renderView = () => {
    switch (view) {
      case View.Dashboard:
        return <Dashboard projects={projects} transactions={transactions} clients={clients} />;
      case View.Clients:
        return <Clients clients={clients} setClients={setClients} />;
      case View.Projects:
        return <Projects projects={projects} setProjects={setProjects} clients={clients} />;
      case View.Transactions:
        return <Transactions 
                  transactions={transactions} 
                  setTransactions={setTransactions} 
                  projects={projects}
                  clientMap={clientMap}
                  projectMap={projectMap}
                />;
      case View.Tax:
        return <Tax transactions={transactions} />;
      case View.Reviews:
        return <Reviews platforms={reviewPlatforms} setPlatforms={setReviewPlatforms} clients={clients} />;
      case View.Community:
        return <Community />;
      case View.Assistant:
        return <Assistant 
                  projects={projects} 
                  businessProfile={businessProfile} 
                  transactions={transactions}
                  clients={clients}
                />;
      case View.Settings:
        return <Settings businessProfile={businessProfile} setBusinessProfile={setBusinessProfile} />;
      default:
        return <Dashboard projects={projects} transactions={transactions} clients={clients} />;
    }
  };

  const getViewTitle = () => {
      switch(view) {
          case View.Dashboard: return 'Dashboard';
          case View.Clients: return 'Clients';
          case View.Projects: return 'Projects';
          case View.Transactions: return 'Transactions';
          case View.Tax: return 'Tax Estimator';
          case View.Reviews: return 'Reviews';
          case View.Community: return 'Community';
          case View.Assistant: return 'Assistant';
          case View.Settings: return 'Settings';
          default: return 'Biz Assistant';
      }
  }

  // If Business Profile is not set up, show Landing Page
  if (!businessProfile.name) {
      return <Landing onComplete={setBusinessProfile} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-gray-100">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden" 
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <Sidebar 
        currentView={view} 
        setView={(v) => {
            setView(v);
            setIsSidebarOpen(false); // Close sidebar on selection (mobile)
        }} 
        isOpen={isSidebarOpen}
        businessProfile={businessProfile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-gray-700 z-10">
             <div className="flex items-center space-x-3">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="text-gray-300 focus:outline-none p-1 rounded hover:bg-gray-700"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="text-lg font-bold text-white">{getViewTitle()}</h1>
             </div>
             <div className="flex items-center text-primary">
                 {businessProfile.logo ? (
                     <img src={businessProfile.logo} alt="Logo" className="h-8 w-8 object-contain rounded bg-white/10 p-1" />
                 ) : (
                     ICONS.PROFIT
                 )}
             </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-20 md:pb-0">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
