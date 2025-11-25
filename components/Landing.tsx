
import React, { useState, useRef } from 'react';
import { BusinessProfile } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import { ICONS } from '../constants';

interface LandingProps {
    onComplete: (profile: BusinessProfile) => void;
}

const Landing: React.FC<LandingProps> = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [logo, setLogo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Please enter your business name.");
            return;
        }
        onComplete({ name, logo: logo || undefined });
    };

    return (
        <div className="min-h-screen bg-background text-white flex flex-col md:flex-row">
            {/* Left Side - Hero / Info */}
            <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center border-r border-gray-800 relative overflow-hidden">
                 {/* Background decoration */}
                 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 to-transparent pointer-events-none" />
                 
                 <div className="relative z-10 space-y-8">
                    <div className="flex items-center space-x-3 mb-8">
                         <div className="bg-white p-2 rounded-xl text-black">
                             {React.cloneElement(ICONS.ASSISTANT, { className: 'h-8 w-8' })}
                         </div>
                         <h1 className="text-3xl font-bold tracking-tighter">Biz Assistant</h1>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                        Master your freelance business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">AI power.</span>
                    </h2>
                    
                    <p className="text-lg text-gray-400 max-w-md">
                        The all-in-one dashboard for South African freelancers. Track projects, manage clients, estimate taxes, and generate quotes in seconds.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                        <div className="flex items-center space-x-3 text-gray-300">
                             <span className="text-white">{ICONS.CHART}</span>
                             <span>Financial Dashboard</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-300">
                             <span className="text-white">{ICONS.ASSISTANT}</span>
                             <span>AI Quote Generator</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-300">
                             <span className="text-white">{ICONS.TAX}</span>
                             <span>SA Tax Estimator</span>
                        </div>
                         <div className="flex items-center space-x-3 text-gray-300">
                             <span className="text-white">{ICONS.PROJECTS_ACTIVE}</span>
                             <span>Project Tracking</span>
                        </div>
                    </div>
                 </div>
            </div>

            {/* Right Side - Setup Form */}
            <div className="md:w-1/2 bg-surface p-8 md:p-16 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full space-y-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white">Let's get you set up</h3>
                        <p className="text-gray-400 mt-2">Customize your workspace to get started.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input 
                            label="Business Name" 
                            id="biz-name" 
                            placeholder="e.g. Acme Creative Studio" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Business Logo (Optional)</label>
                            <div 
                                className="border-2 border-dashed border-gray-700 hover:border-white rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-background/50"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {logo ? (
                                    <div className="relative w-full h-32 flex items-center justify-center">
                                         <img src={logo} alt="Preview" className="max-h-full max-w-full object-contain grayscale" />
                                         <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setLogo(null); }}
                                            className="absolute top-0 right-0 bg-white text-black rounded-full p-1 hover:bg-gray-200 transition"
                                         >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                         </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-gray-800 p-3 rounded-full mb-2">
                                            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm text-gray-400">Click to upload logo</span>
                                        <span className="text-xs text-gray-600 mt-1">PNG, JPG or SVG (Max 2MB)</span>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleLogoUpload} 
                                    className="hidden" 
                                    accept="image/png, image/jpeg, image/svg+xml"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full py-3 text-lg">
                                Enter Dashboard
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Landing;