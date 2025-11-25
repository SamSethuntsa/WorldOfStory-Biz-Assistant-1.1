
import React, { useState, useRef, useEffect } from 'react';
import { BusinessProfile, Client, Project, Transaction, AppData } from '../types';
import Input from './ui/Input';
import Button from './ui/Button';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ------------------------------------------------------------------
// CONFIGURATION: Add your Buy Me a Coffee link here
// ------------------------------------------------------------------
const BUY_ME_A_COFFEE_URL = 'https://buymeacoffee.com/Devs4Good'; 

interface SettingsProps {
    businessProfile: BusinessProfile;
    setBusinessProfile: React.Dispatch<React.SetStateAction<BusinessProfile>>;
}

const Settings: React.FC<SettingsProps> = ({ businessProfile, setBusinessProfile }) => {
    const [name, setName] = useState(businessProfile.name);
    const [logo, setLogo] = useState<string | null>(businessProfile.logo || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const importInputRef = useRef<HTMLInputElement>(null);

    // Hooks to access raw data for export
    const [clients, setClients] = useLocalStorage<Client[]>('biz-assistant-clients', []);
    const [projects, setProjects] = useLocalStorage<Project[]>('biz-assistant-projects', []);
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('biz-assistant-transactions', []);

    // Sync if props change
    useEffect(() => {
        setName(businessProfile.name);
        setLogo(businessProfile.logo || null);
    }, [businessProfile]);

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert("File size too large. Please upload an image smaller than 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogo(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setBusinessProfile({ name, logo: logo || undefined });
        alert("Settings saved successfully!");
    };

    // --- DATA MANAGEMENT ---

    const handleExport = () => {
        const data: AppData = {
            profile: { name, logo: logo || undefined },
            clients,
            projects,
            transactions,
            exportDate: new Date().toISOString()
        };

        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = href;
        link.download = `biz-assistant-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string) as AppData;
                
                // Validate basic structure
                if (!json.clients || !json.projects || !json.transactions) {
                    throw new Error("Invalid backup file format.");
                }

                if(window.confirm(`Found backup from ${new Date(json.exportDate).toLocaleDateString()}. \n\nThis will OVERWRITE your current data. Are you sure?`)) {
                    setBusinessProfile(json.profile);
                    setClients(json.clients);
                    setProjects(json.projects);
                    setTransactions(json.transactions);
                    alert("Data restored successfully!");
                }
            } catch (error) {
                console.error(error);
                alert("Failed to restore data. The file might be corrupted.");
            }
        };
        reader.readAsText(file);
        // Reset input
        if (importInputRef.current) importInputRef.current.value = '';
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-20">
            <h2 className="text-4xl font-bold text-white tracking-tight">Settings</h2>
            
            {/* Support / Donation Section */}
            <div className="bg-white text-black rounded-xl shadow-lg p-6 border border-gray-300 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold flex items-center">
                        <span className="mr-2 text-2xl">☕</span> Support the Developer
                    </h3>
                    <p className="text-sm text-gray-700 mt-2 max-w-md leading-relaxed">
                        Biz Assistant is 100% free to use. There are no subscriptions and no hidden fees. 
                        I build and maintain this in my spare time to help SA freelancers.
                        If this tool saves you time, consider buying me a coffee!
                    </p>
                </div>
                <a 
                    href={BUY_ME_A_COFFEE_URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-shrink-0 bg-black text-white hover:bg-gray-800 font-bold py-3 px-6 rounded-lg transition-colors shadow-md flex items-center border-2 border-transparent group"
                >
                    Buy me a Coffee
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>

            {/* Profile Section */}
            <div className="bg-surface rounded-xl shadow-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-6">Business Profile</h3>
                
                <form onSubmit={handleSave} className="space-y-6">
                    <Input 
                        label="Business Name" 
                        id="biz-name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Business Logo</label>
                        <div className="flex items-center space-x-6">
                            <div 
                                className="h-24 w-24 rounded-xl border-2 border-dashed border-gray-700 hover:border-white flex items-center justify-center cursor-pointer overflow-hidden bg-white/5 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {logo ? (
                                    <img src={logo} alt="Logo" className="w-full h-full object-contain p-2 grayscale" />
                                ) : (
                                    <span className="text-xs text-gray-500 text-center px-1">Upload Logo</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} size="sm">
                                    Change Logo
                                </Button>
                                <p className="text-xs text-gray-500 mt-2">
                                    Recommended size: 200x200px. Max 2MB.<br/>
                                    Supported formats: PNG, JPG, SVG.
                                </p>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleLogoUpload} 
                                className="hidden" 
                                accept="image/png, image/jpeg, image/svg+xml"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-800 flex justify-end">
                        <Button type="submit">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>

            {/* Data Management Section */}
            <div className="bg-surface rounded-xl shadow-lg p-6 border border-gray-800">
                <div className="flex items-center space-x-3 mb-4">
                     <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                     </svg>
                    <h3 className="text-xl font-bold text-white">Device Storage & Cache</h3>
                </div>
                
                <p className="text-sm text-gray-400 mb-6">
                    All your business data (Clients, Projects, Transactions) is stored locally on this device. 
                    Nothing is sent to a server. To prevent data loss (e.g., if you clear your browser cache), 
                    download a backup regularly.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
                        <h4 className="font-bold text-white text-sm mb-2">Backup Data</h4>
                        <p className="text-xs text-gray-500 mb-4">Download a JSON file of your current database.</p>
                        <Button onClick={handleExport} variant="secondary" className="w-full text-sm">
                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download Backup
                        </Button>
                    </div>

                    <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
                        <h4 className="font-bold text-white text-sm mb-2">Restore Data</h4>
                        <p className="text-xs text-gray-500 mb-4">Overwrite current app data with a backup file.</p>
                        <Button onClick={() => importInputRef.current?.click()} variant="danger" className="w-full text-sm">
                             <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0L8 8m4-4v12" /></svg>
                            Restore from File
                        </Button>
                        <input 
                            type="file" 
                            ref={importInputRef} 
                            onChange={handleImport} 
                            className="hidden" 
                            accept=".json"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
