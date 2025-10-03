import React from 'react';
import type { Favorite } from '../types';
import { CloseIcon, MyLocationIcon, TrashIcon } from './Icons';

interface FavoritesPanelProps {
    favorites: Favorite[];
    isOpen: boolean;
    onClose: () => void;
    onSelect: (favorite: Favorite) => void;
    onDelete: (favorite: Favorite) => void;
}

export const FavoritesPanel: React.FC<FavoritesPanelProps> = ({ favorites, isOpen, onClose, onSelect, onDelete }) => {
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
                        <h2 className="text-lg font-bold text-gray-800">Favorite Places</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close favorites panel">
                            <CloseIcon />
                        </button>
                    </header>
                    <div className="flex-grow overflow-y-auto">
                        {favorites.length === 0 ? (
                            <div className="text-center p-8 text-gray-500">
                                <p>You have no saved favorites.</p>
                                <p className="text-sm mt-2">Search for a location and click the star icon to save it.</p>
                            </div>
                        ) : (
                            <ul>
                                {favorites.map((fav) => (
                                    <li key={`${fav.lat}-${fav.lng}`} className="border-b border-gray-200 last:border-b-0">
                                        <div className="flex items-center justify-between p-4 group hover:bg-gray-50">
                                            <span className="font-semibold text-gray-700">{fav.name}</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => onSelect(fav)} className="p-2 text-blue-600 rounded-full hover:bg-blue-100" title="Go to location">
                                                    <MyLocationIcon />
                                                </button>
                                                <button onClick={() => onDelete(fav)} className="p-2 text-red-600 rounded-full hover:bg-red-100" title="Delete favorite">
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};