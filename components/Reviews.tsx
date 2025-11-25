
import React, { useState } from 'react';
import { ReviewPlatform, Client } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { ICONS } from '../constants';
import { generateReviewRequest } from '../services/geminiService';

interface ReviewsProps {
    platforms: ReviewPlatform[];
    setPlatforms: React.Dispatch<React.SetStateAction<ReviewPlatform[]>>;
    clients: Client[];
}

const Reviews: React.FC<ReviewsProps> = ({ platforms, setPlatforms, clients }) => {
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedPlatformId, setSelectedPlatformId] = useState('');
    const [generatedMessage, setGeneratedMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUrlChange = (id: string, newUrl: string) => {
        setPlatforms(platforms.map(p => p.id === id ? { ...p, url: newUrl } : p));
    };

    const handleToggleActive = (id: string) => {
        setPlatforms(platforms.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    };

    const handleGenerateRequest = async () => {
        if (!selectedClient || !selectedPlatformId) {
            alert("Please select a client and a platform.");
            return;
        }

        const platform = platforms.find(p => p.id === selectedPlatformId);
        const client = clients.find(c => c.id === selectedClient);

        if (!platform || !client) return;
        if (!platform.url) {
            alert(`Please add your ${platform.name} link first in the 'My Links' section.`);
            return;
        }

        setIsLoading(true);
        const message = await generateReviewRequest(client.name, platform.url, platform.name);
        setGeneratedMessage(message);
        setIsLoading(false);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <h2 className="text-4xl font-bold text-white tracking-tight">Reviews & Reputation</h2>

            {/* Config Section */}
            <div className="bg-surface rounded-xl shadow-lg p-6 border border-gray-800">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-white text-black p-2 rounded-lg">
                        {ICONS.STAR}
                    </div>
                    <h3 className="text-xl font-bold text-white">My Review Links</h3>
                </div>
                <p className="text-gray-400 text-sm mb-6">
                    Add your unique profile links here. These will be used to generate review requests.
                </p>

                <div className="space-y-4">
                    {platforms.map(platform => (
                        <div key={platform.id} className={`p-4 rounded-lg border transition-colors ${platform.isActive ? 'bg-black/30 border-gray-700' : 'bg-transparent border-gray-800 opacity-60'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <input 
                                        type="checkbox" 
                                        checked={platform.isActive} 
                                        onChange={() => handleToggleActive(platform.id)}
                                        className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-white focus:ring-0"
                                    />
                                    <span className="text-white font-medium">{platform.name}</span>
                                </div>
                            </div>
                            {platform.isActive && (
                                <Input 
                                    label="" 
                                    placeholder={`Paste your ${platform.name} link here...`}
                                    value={platform.url}
                                    onChange={(e) => handleUrlChange(platform.id, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Generator Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface rounded-xl shadow-lg p-6 border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-4">Request a Review</h3>
                    <div className="space-y-4">
                        <Select label="Select Client" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                            <option value="">-- Choose Client --</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </Select>

                        <Select label="Select Platform" value={selectedPlatformId} onChange={(e) => setSelectedPlatformId(e.target.value)}>
                            <option value="">-- Choose Platform --</option>
                            {platforms.filter(p => p.isActive && p.url).map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </Select>

                        <Button onClick={handleGenerateRequest} disabled={isLoading || !selectedClient} className="w-full">
                            {isLoading ? 'Writing...' : 'Generate Message'}
                        </Button>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="bg-surface rounded-xl shadow-lg p-6 border border-gray-800 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-4">Message Preview</h3>
                    <div className="flex-grow bg-black/40 rounded-lg p-4 border border-gray-700 mb-4 min-h-[150px]">
                        {generatedMessage ? (
                            <p className="text-gray-200 whitespace-pre-wrap font-sans text-sm">{generatedMessage}</p>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600">
                                {ICONS.CHAT}
                                <span className="text-xs mt-2">Generated text will appear here</span>
                            </div>
                        )}
                    </div>
                    {generatedMessage && (
                         <Button onClick={() => copyToClipboard(generatedMessage)} variant="secondary" className="w-full">
                            {React.cloneElement(ICONS.COPY, { className: 'h-4 w-4 mr-2' })}
                            Copy Text
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reviews;
