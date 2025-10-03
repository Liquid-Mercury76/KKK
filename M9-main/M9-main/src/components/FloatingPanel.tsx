import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from './Icons';

interface FloatingPanelProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

export const FloatingPanel: React.FC<FloatingPanelProps> = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden w-full">
            <button 
                className="w-full flex justify-between items-center p-2 text-left"
                onClick={() => setIsOpen(p => !p)}
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>
                {isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
            </button>
            {isOpen && (
                <div className="p-3 border-t border-gray-200">
                    {children}
                </div>
            )}
        </div>
    );
};