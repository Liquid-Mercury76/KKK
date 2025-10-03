import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, NavigationArrowIcon, RulerIcon, LayersIcon, BookmarkIcon, InspectIcon, SparklesIcon, DownloadIcon } from './Icons';
import type { MapLayerId, LayerConfig } from '../types';
import { getAutocompleteSuggestions } from '../services/geminiService';

interface ControlPanelProps {
    onSearch: (destination: string) => void;
    onRecenter: () => void;
    onToggleMeasurement: () => void;
    isMeasuring: boolean;
    isSearching: boolean;
    searchError: string | null;
    disableRecenter: boolean;
    onSetLayer: (layerId: MapLayerId) => void;
    currentLayer: MapLayerId;
    onToggleFavorites: () => void;
    mapLayers: Record<MapLayerId, LayerConfig>;
    isInspecting: boolean;
    onToggleInspector: () => void;
    onToggleAiAssistant: () => void;
    installPromptEvent: Event | null;
    onInstallClick: () => void;
}

const ActionButton: React.FC<{
    onClick?: () => void;
    disabled?: boolean;
    title: string;
    isActive?: boolean;
    children: React.ReactNode;
}> = ({ onClick, disabled, title, children, isActive }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`p-3 rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        title={title}
    >
        {children}
    </button>
);

const SuggestionsList: React.FC<{ suggestions: string[]; onSelect: (suggestion: string) => void; isLoading: boolean }> = ({ suggestions, onSelect, isLoading }) => (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
        {isLoading && <div className="p-3 text-sm text-gray-500 animate-pulse">Searching...</div>}
        {!isLoading && suggestions.length > 0 && (
            <ul className="divide-y divide-gray-100">
                {suggestions.map((s, i) => (
                    <li key={i}>
                        <button
                            onClick={() => onSelect(s)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                            {s}
                        </button>
                    </li>
                ))}
            </ul>
        )}
    </div>
);


export const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    const { onSearch, onRecenter, onToggleMeasurement, isMeasuring, isSearching, searchError, disableRecenter, onSetLayer, currentLayer, onToggleFavorites, mapLayers, isInspecting, onToggleInspector, onToggleAiAssistant, installPromptEvent, onInstallClick } = props;
    
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [showLayerMenu, setShowLayerMenu] = useState(false);
    
    const searchRef = useRef<HTMLDivElement>(null);
    const layerMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }
        
        const handler = setTimeout(async () => {
            setIsLoadingSuggestions(true);
            const fetchedSuggestions = await getAutocompleteSuggestions(query);
            setSuggestions(fetchedSuggestions);
            setIsLoadingSuggestions(false);
        }, 300);

        return () => clearTimeout(handler);
    }, [query]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuggestions(false);
        onSearch(query);
    };

    const handleSelectSuggestion = (suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        onSearch(suggestion);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
             if (layerMenuRef.current && !layerMenuRef.current.contains(event.target as Node)) {
                setShowLayerMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <div className="absolute left-4 right-4 z-10 flex flex-col gap-2 md:right-auto md:w-96 control-panel-top">
                <div ref={searchRef} className="relative">
                    <form onSubmit={handleSearchSubmit} className="bg-white rounded-full shadow-lg flex items-center h-14">
                        <div className="p-4">
                            <SearchIcon className="w-6 h-6 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Search for a place..."
                            className="w-full bg-transparent text-gray-900 placeholder-gray-500 text-lg focus:outline-none"
                            aria-label="Search destination"
                        />
                        <button
                            type="submit"
                            disabled={isSearching || !query}
                            className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-gray-500 transition-colors m-2"
                            aria-label="Search"
                        >
                            {isSearching ? <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : <SearchIcon className="w-5 h-5 text-white" />}
                        </button>
                    </form>
                    {showSuggestions && (query.length > 0) && (
                        <SuggestionsList suggestions={suggestions} onSelect={handleSelectSuggestion} isLoading={isLoadingSuggestions} />
                    )}
                </div>

                {searchError && <div className="bg-red-100 text-red-800 border border-red-200 rounded-lg shadow-lg p-3 text-center text-sm"><span>{searchError}</span></div>}
                {isMeasuring && <div className="bg-blue-100 text-blue-800 border border-blue-200 rounded-lg shadow-lg p-3 text-center text-sm"><span>Measuring Mode: Click map to add points.</span></div>}
            </div>

            <div className="absolute right-4 z-10 flex flex-col gap-3 control-panel-side">
                <ActionButton onClick={onRecenter} disabled={disableRecenter} title="Center on my location"><NavigationArrowIcon /></ActionButton>
                
                <div className="relative" ref={layerMenuRef}>
                    <ActionButton onClick={() => setShowLayerMenu(p => !p)} title="Change map layer"><LayersIcon /></ActionButton>
                    {showLayerMenu && (
                        <div className="absolute right-full top-0 mr-2 w-32 bg-white rounded-lg shadow-xl py-1">
                            {/* FIX: Explicitly type 'layer' to resolve type inference issue. */}
                            {Object.values(mapLayers).map((layer: LayerConfig) => (
                                <button key={layer.id} onClick={() => { onSetLayer(layer.id); setShowLayerMenu(false); }} className={`w-full text-left px-4 py-2 text-sm ${currentLayer === layer.id ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                                    {layer.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <ActionButton onClick={onToggleFavorites} title="Show favorites"><BookmarkIcon /></ActionButton>
                <ActionButton onClick={onToggleMeasurement} title={isMeasuring ? 'Stop measuring' : 'Measure distance'} isActive={isMeasuring}><RulerIcon /></ActionButton>
                <ActionButton onClick={onToggleInspector} title="Inspect map point" isActive={isInspecting}><InspectIcon /></ActionButton>
                <ActionButton onClick={onToggleAiAssistant} title="AI Assistant"><SparklesIcon /></ActionButton>
                 {installPromptEvent && (
                    <ActionButton onClick={onInstallClick} title="Install App">
                        <DownloadIcon />
                    </ActionButton>
                )}
            </div>
        </>
    );
};
