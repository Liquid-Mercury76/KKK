import React from 'react';
import { InfoIcon } from './Icons';

interface PermissionsModalProps {
    onClose: () => void;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({ onClose }) => {
    return (
        <div 
            className="absolute inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="permissions-title"
        >
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
                <div className="flex justify-center mb-4">
                    <InfoIcon className="w-12 h-12 text-blue-500" />
                </div>
                <h2 id="permissions-title" className="text-xl font-bold text-gray-900 mb-2">Location Access Required</h2>
                <p className="text-gray-600 mb-6">
                    This app needs access to your location to show your position on the map. Please enable location services in your browser's site settings.
                </p>
                <button
                    onClick={onClose}
                    className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500"
                >
                    I Understand
                </button>
            </div>
        </div>
    );
};