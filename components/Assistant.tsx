
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Project, QuoteResponse, BusinessProfile, Transaction, Client } from '../types';
import { generateQuoteFromBrief, generateCommunication, askBusinessCoach } from '../services/geminiService';
import Button from './ui/Button';
import TextArea from './ui/TextArea';
import Input from './ui/Input';
import Select from './ui/Select';
import { ICONS } from '../constants';

interface AssistantProps {
    projects: Project[];
    businessProfile: BusinessProfile;
    transactions: Transaction[];
    clients: Client[];
}

type Tab = 'quote' | 'comms' | 'coach';

const Assistant: React.FC<AssistantProps> = ({ projects, businessProfile, transactions, clients }) => {
    const [activeTab, setActiveTab] = useState<Tab>('quote');

    // Quote State
    const [brief, setBrief] = useState('');
    const [quote, setQuote] = useState<QuoteResponse | null>(null);
    const [isQuoteLoading, setIsQuoteLoading] = useState(false);
    const [quoteError, setQuoteError] = useState<string | null>(null);
    const [logo, setLogo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Comms State
    const [commTopic, setCommTopic] = useState('');
    const [commType, setCommType] = useState<'email' | 'whatsapp' | 'sms' | 'linkedin'>('email');
    const [commRecipient, setCommRecipient] = useState('');
    const [commTone, setCommTone] = useState<'professional' | 'friendly' | 'urgent' | 'sales'>('professional');
    const [commResult, setCommResult] = useState('');
    const [isCommLoading, setIsCommLoading] = useState(false);

    // Coach State
    const [coachQuery, setCoachQuery] = useState('');
    const [coachResponse, setCoachResponse] = useState('');
    const [isCoachLoading, setIsCoachLoading] = useState(false);

    // Initial logo setup
    useEffect(() => {
        if (businessProfile.logo) {
            setLogo(businessProfile.logo);
        }
    }, [businessProfile.logo]);

    // Derived Context for Coach
    const financialContext = useMemo(() => {
        const totalRevenue = transactions.filter(t => t.type === 'revenue').reduce((a, b) => a + b.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
        return {
            totalRevenue,
            totalExpenses,
            netProfit: totalRevenue - totalExpenses,
            clientCount: clients.length,
            projectCount: projects.length,
            businessName: businessProfile.name
        };
    }, [transactions, clients, projects, businessProfile]);


    // --- Handlers ---

    const handleGenerateQuote = async () => {
        if (!brief) {
            setQuoteError('Please paste the client brief first.');
            return;
        }
        setIsQuoteLoading(true);
        setQuoteError(null);
        setQuote(null);
        try {
            const result = await generateQuoteFromBrief(brief, projects);
            if (result) {
                setQuote(result);
            } else {
                setQuoteError('Failed to generate a quote. The AI may be busy. Please try again.');
            }
        } catch (e) {
            setQuoteError('An unexpected error occurred.');
            console.error(e);
        }
        setIsQuoteLoading(false);
    };

    const handleGenerateComm = async () => {
        if (!commTopic) return;
        setIsCommLoading(true);
        const result = await generateCommunication(commType, commTopic, commRecipient || 'Client', commTone);
        setCommResult(result);
        setIsCommLoading(false);
    };

    const handleAskCoach = async () => {
        if (!coachQuery) return;
        setIsCoachLoading(true);
        const result = await askBusinessCoach(coachQuery, financialContext);
        setCoachResponse(result);
        setIsCoachLoading(false);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { 
                alert("File size too large. Max 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogo(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white tracking-tight">AI Assistant</h2>
            
            {/* Tabs */}
            <div className="flex space-x-2 bg-surface p-1 rounded-lg inline-flex">
                <button 
                    onClick={() => setActiveTab('quote')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'quote' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                >
                    Quote Generator
                </button>
                <button 
                    onClick={() => setActiveTab('comms')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'comms' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                >
                    Comms Hub
                </button>
                <button 
                    onClick={() => setActiveTab('coach')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'coach' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                >
                    Business Coach
                </button>
            </div>

            {/* TAB: Quote Generator */}
            {activeTab === 'quote' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="bg-surface rounded-xl shadow-lg p-6">
                        <h3 className="text-2xl font-bold text-white mb-1">Quote Generator</h3>
                        <p className="text-gray-400 mb-4">Paste your client's request. The AI will generate a structured PDF-style quote.</p>
                        
                        <div className="space-y-4">
                            <TextArea
                                label="Client Request / Brief"
                                id="client-brief"
                                rows={4}
                                value={brief}
                                onChange={(e) => setBrief(e.target.value)}
                                placeholder="e.g., 'Hi, we need a new logo and a one-page website...'"
                            />
                            <div className="flex justify-end">
                                <Button onClick={handleGenerateQuote} disabled={isQuoteLoading}>
                                    {isQuoteLoading ? 'Thinking...' : (
                                        <>
                                            {React.cloneElement(ICONS.MAGIC, { className: 'h-5 w-5 mr-2' })}
                                            Generate Quote
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {quoteError && <div className="p-4 bg-red-900/20 border border-red-900 text-red-200 rounded-lg">{quoteError}</div>}

                    {quote && (
                        <div className="border-t border-gray-700/50 pt-8 space-y-8">
                             {/* The Quote Document Preview */}
                            <div className="max-w-4xl mx-auto bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden transform transition-all">
                                {/* Document Header */}
                                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start bg-gray-50/50">
                                    <div className="mb-4 md:mb-0">
                                        <div 
                                            className="relative group cursor-pointer w-48 h-24 border-2 border-dashed border-gray-300 hover:border-black rounded-lg flex items-center justify-center overflow-hidden bg-white transition-colors"
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Click to change logo"
                                        >
                                            {logo ? (
                                                <img src={logo} alt="Company Logo" className="w-full h-full object-contain p-2 grayscale" />
                                            ) : (
                                                <div className="text-center p-2">
                                                    <span className="text-xs text-gray-500 font-medium block">Upload Logo</span>
                                                </div>
                                            )}
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={handleLogoUpload} 
                                                className="hidden" 
                                                accept="image/png, image/jpeg, image/svg+xml"
                                            />
                                        </div>
                                        <div className="mt-2 pl-1">
                                             <h3 className="text-lg font-bold text-gray-800">{businessProfile.name}</h3>
                                        </div>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <h2 className="text-4xl font-extrabold text-black tracking-tight uppercase">Quote</h2>
                                        <div className="mt-2 text-sm text-gray-600 space-y-1">
                                            <p>Date: <span className="font-medium text-black">{new Date().toLocaleDateString('en-ZA')}</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 space-y-10">
                                    <div>
                                        <h3 className="text-3xl font-bold text-black mb-3">{quote.projectName}</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-black">
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Project Brief</h4>
                                            <p className="text-gray-800 leading-relaxed">{quote.projectBrief}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div>
                                            <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-4 border-b border-gray-300 pb-2">Scope of Work</h4>
                                            <ul className="space-y-3">
                                                {quote.scopeOfWork.map((item, i) => (
                                                    <li key={i} className="flex items-start text-sm text-gray-800">
                                                        <span className="mr-2 text-black font-bold text-lg leading-none">•</span>
                                                        <span className="leading-snug">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                         <div>
                                            <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-4 border-b border-gray-300 pb-2">Deliverables</h4>
                                            <ul className="space-y-3">
                                                {quote.deliverables.map((item, i) => (
                                                    <li key={i} className="flex items-start text-sm text-gray-800">
                                                         <svg className="h-5 w-5 mr-2 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span className="leading-snug">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                     <div className="flex items-center space-x-3 bg-gray-100 p-4 rounded-lg text-gray-900 border border-gray-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-wider block text-gray-500">Estimated Timeline</span>
                                            <span className="font-bold text-lg">{quote.estimatedTimeline}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-4">Investment Breakdown</h4>
                                        <div className="overflow-hidden border border-gray-300 rounded-lg shadow-sm">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Description</th>
                                                        <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {quote.pricing.breakdown.map((item, i) => (
                                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.item}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-800 text-right font-mono">{formatCurrency(item.cost)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-100 border-t border-gray-300">
                                                    <tr>
                                                        <td className="px-6 py-5 text-base font-bold text-black">Total</td>
                                                        <td className="px-6 py-5 text-xl font-bold text-black text-right font-mono">{formatCurrency(quote.pricing.total)}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB: Comms Hub */}
            {activeTab === 'comms' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
                    <div className="space-y-6">
                        <div className="bg-surface rounded-xl shadow-lg p-6">
                            <h3 className="text-2xl font-bold text-white mb-4">Communication Hub</h3>
                            <p className="text-gray-400 mb-6 text-sm">Draft professional emails, WhatsApps, or marketing copy tailored to your South African clients.</p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {(['email', 'whatsapp', 'sms', 'linkedin'] as const).map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setCommType(type)}
                                                className={`py-2 text-xs font-bold uppercase rounded-md border ${commType === type ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Select label="Recipient" value={commRecipient} onChange={(e) => setCommRecipient(e.target.value)}>
                                        <option value="">Generic Client</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </Select>
                                    <Select label="Tone" value={commTone} onChange={(e) => setCommTone(e.target.value as any)}>
                                        <option value="professional">Professional</option>
                                        <option value="friendly">Friendly / Casual</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="sales">Sales / Hype</option>
                                    </Select>
                                </div>

                                <TextArea
                                    label="Goal / Topic"
                                    placeholder="e.g. Late payment reminder for Invoice #001, OR, Introducing my new logo design package."
                                    rows={4}
                                    value={commTopic}
                                    onChange={(e) => setCommTopic(e.target.value)}
                                />

                                <Button onClick={handleGenerateComm} disabled={!commTopic || isCommLoading} className="w-full">
                                    {isCommLoading ? 'Drafting...' : (
                                        <>
                                            {React.cloneElement(ICONS.CHAT, { className: 'h-5 w-5 mr-2' })}
                                            Generate Draft
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                         <div className={`bg-surface rounded-xl shadow-lg p-6 h-full flex flex-col border border-gray-800 ${!commResult && 'justify-center items-center text-center'}`}>
                            {commResult ? (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-gray-400 font-bold uppercase tracking-wider text-xs">Generated Draft</h4>
                                        <button 
                                            onClick={() => copyToClipboard(commResult)}
                                            className="text-white hover:text-gray-300 text-sm flex items-center"
                                        >
                                            {React.cloneElement(ICONS.COPY, { className: 'h-4 w-4 mr-1' })} Copy
                                        </button>
                                    </div>
                                    <div className="bg-black/30 p-4 rounded-lg flex-grow whitespace-pre-wrap text-gray-200 font-mono text-sm leading-relaxed border border-gray-800">
                                        {commResult}
                                    </div>
                                </>
                            ) : (
                                <div className="text-gray-500">
                                    {ICONS.CHAT}
                                    <p className="mt-2 text-sm">Your drafted message will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: Business Coach */}
            {activeTab === 'coach' && (
                <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
                    <div className="text-center mb-8">
                        <div className="inline-block p-3 bg-surface rounded-full mb-4 border border-gray-700">
                            {React.cloneElement(ICONS.BULB, { className: 'h-8 w-8 text-white' })}
                        </div>
                        <h3 className="text-2xl font-bold text-white">Biz Coach</h3>
                        <p className="text-gray-400 mt-2">Ask a question about your business. The Coach knows your current financials and offers practical, local advice.</p>
                    </div>

                    <div className="bg-surface rounded-xl shadow-lg border border-gray-800 overflow-hidden">
                        <div className="p-6 space-y-4">
                            {/* Context Indicators */}
                            <div className="flex space-x-4 text-xs text-gray-500 mb-4 justify-center">
                                <span className="flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                    Context: Revenue {formatCurrency(financialContext.totalRevenue)}
                                </span>
                                <span className="flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                                    Context: Expenses {formatCurrency(financialContext.totalExpenses)}
                                </span>
                            </div>

                            {coachResponse && (
                                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 mb-6">
                                    <h5 className="font-bold text-white mb-2 flex items-center">
                                        Coach says:
                                    </h5>
                                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{coachResponse}</p>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <div className="flex-grow">
                                    <Input 
                                        label="" 
                                        placeholder="e.g. Should I register for VAT yet? OR How can I reduce my software expenses?"
                                        value={coachQuery}
                                        onChange={(e) => setCoachQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAskCoach()}
                                    />
                                </div>
                                <div className="pt-1">
                                    <Button onClick={handleAskCoach} disabled={!coachQuery || isCoachLoading} className="h-[42px]">
                                        {isCoachLoading ? 'Thinking...' : 'Ask'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        
                         <div className="bg-black/20 p-4 text-center">
                            <p className="text-xs text-gray-500">The Coach uses AI. Always verify financial advice with a professional.</p>
                        </div>
                    </div>

                    {/* Quick Prompts */}
                    {!coachResponse && (
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button 
                                onClick={() => { setCoachQuery("How can I improve my net profit based on my current stats?"); }}
                                className="p-4 bg-surface border border-gray-800 rounded-lg hover:border-white transition-colors text-left"
                            >
                                <span className="text-sm font-bold text-white block">💰 Improve Profit</span>
                                <span className="text-xs text-gray-400">Get tips to boost your bottom line.</span>
                            </button>
                            <button 
                                onClick={() => { setCoachQuery("Draft a polite message to a client who hasn't paid."); }}
                                className="p-4 bg-surface border border-gray-800 rounded-lg hover:border-white transition-colors text-left"
                            >
                                <span className="text-sm font-bold text-white block">⏳ Late Payments</span>
                                <span className="text-xs text-gray-400">Ask for advice on debt collection.</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Assistant;
