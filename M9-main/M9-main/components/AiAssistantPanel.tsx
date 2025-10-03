import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { CloseIcon, PaperAirplaneIcon, SparklesIcon } from './Icons';

interface AiAssistantPanelProps {
    isOpen: boolean;
    onClose: () => void;
    history: ChatMessage[];
    onSendQuery: (query: string) => void;
    isReplying: boolean;
}

export const AiAssistantPanel: React.FC<AiAssistantPanelProps> = ({ isOpen, onClose, history, onSendQuery, isReplying }) => {
    const [query, setQuery] = useState('');
    const chatHistoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [history]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isReplying) {
            onSendQuery(query);
            setQuery('');
        }
    };

    return (
        <>
            <div 
                className={`absolute inset-0 bg-black z-20 transition-opacity duration-300 ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            />
            <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                           <SparklesIcon />
                           <h2 className="text-lg font-bold text-gray-800">AI Assistant</h2>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close AI assistant panel">
                            <CloseIcon />
                        </button>
                    </header>
                    <div ref={chatHistoryRef} className="flex-grow overflow-y-auto p-4 space-y-4">
                        {history.map((msg, index) => (
                             <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                   <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isReplying && (
                             <div className="flex gap-3 justify-start">
                                <div className="max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                                   <div className="flex items-center justify-center gap-2">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                                   </div>
                                </div>
                            </div>
                        )}
                         {history.length === 0 && !isReplying && (
                            <div className="text-center text-gray-500 pt-10">
                                <p>Ask me anything about your surroundings!</p>
                                <p className="text-xs mt-2">e.g., "Where is the nearest hospital?"</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-200">
                        <form onSubmit={handleSubmit} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ask a question..."
                                className="flex-grow bg-gray-100 text-gray-900 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isReplying}
                            />
                            <button
                                type="submit"
                                disabled={isReplying || !query.trim()}
                                className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                                aria-label="Send message"
                            >
                                <PaperAirplaneIcon />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};