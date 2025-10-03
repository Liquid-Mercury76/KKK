import React from 'react';
import type { Route } from '../types';
import { CloseIcon, EtaIcon, StepIcon } from './Icons';

interface DirectionsPanelProps {
    route: Route | null;
    isOpen: boolean;
    onClose: () => void;
}

export const DirectionsPanel: React.FC<DirectionsPanelProps> = ({ route, isOpen, onClose }) => {
    if (!route) return null;

    return (
        <>
            <div
                className={`absolute inset-0 bg-black z-20 transition-opacity duration-300 ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            />
            <div className={`absolute bottom-0 left-0 right-0 bg-white shadow-2xl z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'} rounded-t-2xl max-h-[60vh]`}>
                <div className="flex flex-col h-full">
                    <header className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <EtaIcon />
                            <h2 className="text-lg font-bold text-gray-800">
                                {route.eta}
                            </h2>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close directions panel">
                            <CloseIcon />
                        </button>
                    </header>
                    <div className="flex-grow overflow-y-auto">
                        <ul className="divide-y divide-gray-200">
                            {route.steps.map((step, index) => (
                                <li key={index} className="p-4 flex items-start gap-4">
                                    <div className="flex-shrink-0 pt-1">
                                       <StepIcon />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-800">{step.instruction}</p>
                                        <p className="text-sm text-gray-500">{step.distance}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};