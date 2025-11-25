
import React, { useState, useEffect, useRef } from 'react';
import { CommunityPost } from '../types';
import Button from './ui/Button';
import TextArea from './ui/TextArea';
import { ICONS } from '../constants';
import { simulateCommunityInteraction } from '../services/geminiService';

const Community: React.FC = () => {
    const [posts, setPosts] = useState<CommunityPost[]>([
        {
            id: 'welcome',
            author: 'Biz Assistant Bot',
            role: 'Moderator',
            content: 'Welcome to the Community Hub! This is an offline-first space. While we are in Beta, reply to this thread or post a new topic to chat with our AI Business Personas about your challenges.',
            timestamp: 'Pinned',
            isUser: false
        }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [posts]);

    const handlePost = async () => {
        if (!userInput.trim()) return;

        const newPost: CommunityPost = {
            id: crypto.randomUUID(),
            author: 'You',
            role: 'Owner',
            content: userInput,
            timestamp: 'Just now',
            isUser: true
        };

        setPosts(prev => [...prev, newPost]);
        setUserInput('');
        setIsThinking(true);

        // Simulate network delay for realism
        setTimeout(async () => {
            const responses = await simulateCommunityInteraction(newPost.content, "Freelance Business");
            setPosts(prev => [...prev, ...responses]);
            setIsThinking(false);
        }, 1500);
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-surface rounded-xl shadow-lg border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white text-black p-2 rounded-lg">
                            {ICONS.GLOBE}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Biz Network</h2>
                            <p className="text-xs text-green-400 flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                                AI Community Online
                            </p>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 bg-black/40 px-2 py-1 rounded border border-gray-800">
                        Beta Mode
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {posts.map(post => (
                        <div key={post.id} className={`flex ${post.isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] ${post.isUser ? 'order-1' : 'order-2'}`}>
                                <div className={`flex items-baseline space-x-2 mb-1 ${post.isUser ? 'justify-end' : 'justify-start'}`}>
                                    <span className="text-sm font-bold text-white">{post.author}</span>
                                    <span className="text-xs text-gray-500">{post.role}</span>
                                </div>
                                <div className={`p-4 rounded-2xl ${
                                    post.isUser 
                                    ? 'bg-white text-black rounded-tr-none' 
                                    : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                                }`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                                </div>
                                <span className={`text-[10px] text-gray-600 mt-1 block ${post.isUser ? 'text-right' : 'text-left'}`}>
                                    {post.timestamp}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start">
                            <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700 flex space-x-1 items-center">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                <div className="p-4 bg-gray-900/50 border-t border-gray-800">
                    <div className="flex gap-2">
                        <div className="flex-grow">
                            <TextArea 
                                label=""
                                placeholder="Share an update or ask for advice..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                rows={1}
                                className="min-h-[50px] resize-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handlePost();
                                    }
                                }}
                            />
                        </div>
                        <div className="flex items-end pb-1">
                             <Button onClick={handlePost} disabled={!userInput.trim() || isThinking} className="h-[42px] w-[42px] !px-0 flex items-center justify-center">
                                <svg className="h-5 w-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                             </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar / Opportunities */}
            <div className="lg:w-80 space-y-6">
                <div className="bg-surface rounded-xl shadow-lg border border-gray-800 p-5">
                    <h3 className="text-lg font-bold text-white mb-4">External Communities</h3>
                    <div className="space-y-3">
                        <a href="#" className="block p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition flex items-center justify-between group">
                            <span className="text-sm text-gray-300 group-hover:text-white">Business Unity SA</span>
                            <svg className="h-4 w-4 text-gray-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                        <a href="#" className="block p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition flex items-center justify-between group">
                            <span className="text-sm text-gray-300 group-hover:text-white">Heavy Chef</span>
                            <svg className="h-4 w-4 text-gray-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                         <a href="#" className="block p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition flex items-center justify-between group">
                            <span className="text-sm text-gray-300 group-hover:text-white">Reddit r/SmallBusinessZA</span>
                            <svg className="h-4 w-4 text-gray-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                    </div>
                </div>

                <div className="bg-surface rounded-xl shadow-lg border border-gray-800 p-5">
                    <h3 className="text-lg font-bold text-white mb-4">Opportunities Board</h3>
                    <p className="text-xs text-gray-500 mb-4">AI-curated opportunities for your profile.</p>
                    
                    <div className="space-y-4">
                        <div className="p-3 border-l-2 border-white bg-gray-900/50">
                            <h4 className="text-sm font-bold text-white">Tender Alert: Digital Svcs</h4>
                            <p className="text-xs text-gray-400 mt-1">Gov dept looking for SME service providers for 2025.</p>
                        </div>
                        <div className="p-3 border-l-2 border-gray-500 bg-gray-900/50">
                            <h4 className="text-sm font-bold text-white">Networking Event: JHB</h4>
                            <p className="text-xs text-gray-400 mt-1">First Thursdays Business Mixer at Keyes Art Mile.</p>
                        </div>
                        <div className="p-3 border-l-2 border-gray-500 bg-gray-900/50">
                            <h4 className="text-sm font-bold text-white">Grant: Youth Biz</h4>
                            <p className="text-xs text-gray-400 mt-1">NYDA applications open for equipment funding.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
