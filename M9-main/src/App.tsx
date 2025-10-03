
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import { useGeolocation } from './hooks/useGeolocation';
import { useSatelliteData } from './hooks/useSatelliteData';
import { geocodeLocation, getDirections, getAiAssistantResponse, fetchPois } from './services/geminiService';
import type { Point, SearchResult, Favorite, Route, MapLayerId, LayerConfig, ChatMessage, Poi, PoiCategory } from './types';
import { BottomPanels } from './components/BottomPanels';
import { ControlPanel } from './components/ControlPanel';
import { PermissionsModal } from './components/PermissionsModal';
import { FavoritesPanel } from './components/FavoritesPanel';
import { DirectionsPanel } from './components/DirectionsPanel';
import { AiAssistantPanel } from './components/AiAssistantPanel';
import { HospitalIcon, GasStationIcon, AirportIcon, MallIcon, BusStopIcon, StadiumIcon } from './components/Icons';

const MAP_LAYERS: Record<MapLayerId, LayerConfig> = {
    light: {
        id: 'light',
        name: 'Light',
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    dark: {
        id: 'dark',
        name: 'Dark',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    satellite: {
        id: 'satellite',
        name: 'Satellite',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
};

// Configuration for POI visibility and importance
const POI_CATEGORY_CONFIG: Record<PoiCategory, { minZoom: number }> = {
    airport: { minZoom: 13 },
    stadium: { minZoom: 14 },
    hospital: { minZoom: 14 },
    mall: { minZoom: 15 },
    'gas-station': { minZoom: 16 },
    'bus-stop': { minZoom: 16 },
    'traffic-light': { minZoom: 17 },
};


const calculateDistance = (point1: Point, point2: Point): number => {
    const R = 6371e3; // metres
    const φ1 = point1.lat * Math.PI / 180;
    const φ2 = point2.lat * Math.PI / 180;
    const Δφ = (point2.lat - point1.lat) * Math.PI / 180;
    const Δλ = (point2.lng - point1.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

const RecenterMap: React.FC<{ center: LatLngExpression, zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

// Debounce utility
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<F>): void => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), waitFor);
    };
};


const PoiManager: React.FC<{ onBoundsChange: (bounds: L.LatLngBounds, zoom: number) => void }> = ({ onBoundsChange }) => {
    const map = useMapEvents({
        load: () => onBoundsChange(map.getBounds(), map.getZoom()), // Fire on initial load
        moveend: () => onBoundsChange(map.getBounds(), map.getZoom()),
        zoomend: () => onBoundsChange(map.getBounds(), map.getZoom()),
    });
    return null;
};


const MapEvents: React.FC<{
    onClick?: (latlng: L.LatLng) => void;
    onMouseMove?: (latlng: L.LatLng) => void;
}> = ({ onClick, onMouseMove }) => {
    const map = useMap();
    useEffect(() => {
        if (onClick) {
            const handleClick = (e: L.LeafletMouseEvent) => onClick(e.latlng);
            map.on('click', handleClick);
            return () => { map.off('click', handleClick); };
        }
    }, [map, onClick]);
    
    useEffect(() => {
        if (onMouseMove) {
            const handleMouseMove = (e: L.LeafletMouseEvent) => onMouseMove(e.latlng);
            map.on('mousemove', handleMouseMove);
            return () => { map.off('mousemove', handleMouseMove); };
        }
    }, [map, onMouseMove]);

    return null;
};

const App: React.FC = () => {
    const { location, error: geoError } = useGeolocation();
    const { satellites } = useSatelliteData();
    const [mapCenter, setMapCenter] = useState<LatLngExpression>([-15.3875, 28.3228]);
    const [zoom, setZoom] = useState(13);
    
    const [isMeasuring, setIsMeasuring] = useState(false);
    const [measurementPoints, setMeasurementPoints] = useState<Point[]>([]);

    const [inspectorData, setInspectorData] = useState<Point | null>(null);
    const [isInspecting, setIsInspecting] = useState(false);
    
    const [searchedLocation, setSearchedLocation] = useState<SearchResult | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const [route, setRoute] = useState<Route | null>(null);
    const [showDirections, setShowDirections] = useState(false);

    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [showFavorites, setShowFavorites] = useState(false);

    const [currentLayer, setCurrentLayer] = useState<MapLayerId>('light');

    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    
    const [showAiAssistant, setShowAiAssistant] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isAiReplying, setIsAiReplying] = useState(false);

    const [pois, setPois] = useState<Poi[]>([]);
    const [visiblePois, setVisiblePois] = useState<Poi[]>([]);
    const [isFetchingPois, setIsFetchingPois] = useState(false);
    
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const mapRef = useRef<L.Map>(null);
    const lastFetchedBoundsRef = useRef<L.LatLngBounds | null>(null);
    const isFetchingPoisRef = useRef(isFetchingPois);
    useEffect(() => {
        isFetchingPoisRef.current = isFetchingPois;
    }, [isFetchingPois]);

    // Effect for Service Worker registration and online/offline status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('Service Worker registered with scope:', registration.scope);
                    })
                    .catch(error => {
                        console.error('Service Worker registration failed:', error);
                    });
            });
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        const storedFavorites = localStorage.getItem('gps-favorites');
        if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    }, []);

    const userMarkerIcon = useMemo(() => new L.DivIcon({
        className: 'gps-marker', html: '<div class="gps-dot"></div>',
        iconSize: [24, 24], iconAnchor: [12, 12]
    }), []);

    const pinMarkerIcon = useMemo(() => L.icon({
        iconUrl: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 005.16-4.242 12.082 12.082 0 003.06-7.09V6.11a3.075 3.075 0 00-3.075-3.075H6.11A3.075 3.075 0 003.036 6.11v4.912a12.083 12.083 0 003.06 7.09 16.975 16.975 0 005.16 4.242zM12 10a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clip-rule="evenodd" /></svg>')}`,
        iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38]
    }), []);

    const poiIcons = useMemo<Record<PoiCategory, L.DivIcon>>(() => {
        const createIcon = (iconSvg: string) => L.divIcon({
            html: `<div class="p-1 bg-white rounded-full shadow">${iconSvg}</div>`,
            className: '',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });
        return {
            hospital: createIcon(HospitalIcon()),
            'gas-station': createIcon(GasStationIcon()),
            airport: createIcon(AirportIcon()),
            mall: createIcon(MallIcon()),
            'bus-stop': createIcon(BusStopIcon()),
            stadium: createIcon(StadiumIcon()),
            'traffic-light': createIcon(''), // Placeholder
        };
    }, []);


    useEffect(() => { if (geoError?.includes('denied')) setShowPermissionsModal(true); }, [geoError]);

    const handleSearch = useCallback(async (query: string) => {
        if (!query.trim()) return;
        setIsSearching(true);
        setSearchError(null);
        setSearchedLocation(null);
        setRoute(null);
        setShowDirections(false);
        
        try {
            const endPoint = await geocodeLocation(query);
            if (!endPoint) throw new Error(`Could not find location: ${query}`);

            setSearchedLocation({ name: query, ...endPoint });
            setMapCenter([endPoint.lat, endPoint.lng]);
            setZoom(15);
        } catch (err: any) {
            setSearchError(err.message || 'Failed to search.');
        } finally {
            setIsSearching(false);
        }
    }, []);

    const handleRequestDirections = useCallback(async () => {
        if (!location) {
            setSearchError("Your location is not available. Cannot get directions.");
            return;
        }
        if (!searchedLocation) return;
        
        setIsSearching(true);
        setSearchError(null);
        setRoute(null);

        try {
            const startPoint = { lat: location.latitude, lng: location.longitude };
            const result = await getDirections(startPoint, searchedLocation, 'drive'); // Default to drive
            
            if (result && result.polyline.length > 0) {
                setRoute(result);
                setShowDirections(true);
                if (mapRef.current) {
                    const bounds = L.latLngBounds(result.polyline.map(p => [p.lat, p.lng]));
                    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
                }
            } else {
                throw new Error('Could not find a route.');
            }
        } catch (err: any) {
            setSearchError(err.message || 'Failed to get directions.');
        } finally {
            setIsSearching(false);
        }
    }, [location, searchedLocation]);

    const handleRecenter = useCallback(() => {
        if (location) {
            setMapCenter([location.latitude, location.longitude]);
            setZoom(16);
        }
    }, [location]);

    const toggleMeasurement = useCallback(() => { setIsMeasuring(prev => !prev); if (!isMeasuring) setMeasurementPoints([]); }, [isMeasuring]);
    const handleMapClick = useCallback((latlng: L.LatLng) => { if (isMeasuring) setMeasurementPoints(prev => [...prev, { lat: latlng.lat, lng: latlng.lng }]); }, [isMeasuring]);
    const handleMouseMove = useCallback((latlng: L.LatLng) => { if (isInspecting) setInspectorData({ lat: latlng.lat, lng: latlng.lng }); }, [isInspecting]);
    
    const handleToggleFavorite = useCallback((place: SearchResult) => {
        setFavorites(prev => {
            const isFavorite = prev.some(f => f.lat === place.lat && f.lng === place.lng);
            const newFavorites = isFavorite ? prev.filter(f => f.lat !== place.lat || f.lng !== place.lng) : [...prev, place];
            localStorage.setItem('gps-favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    }, []);
    
    const handleSelectFavorite = useCallback((fav: Favorite) => {
        handleSearch(fav.name);
        setShowFavorites(false);
    }, [handleSearch]);

    const handleAiQuery = useCallback(async (query: string) => {
        setIsAiReplying(true);
        setChatHistory(prev => [...prev, { role: 'user', text: query }]);
        try {
            const userLocation = location ? { lat: location.latitude, lng: location.longitude } : null;
            const response = await getAiAssistantResponse(query, userLocation);
            setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
        } catch (error) {
            console.error("AI Assistant Error:", error);
            const errorMessage = error instanceof Error ? error.message : "Sorry, I couldn't process that request.";
            setChatHistory(prev => [...prev, { role: 'ai', text: errorMessage }]);
        } finally {
            setIsAiReplying(false);
        }
    }, [location]);

    const debouncedFetchPois = useMemo(() => 
        debounce(async (bounds: L.LatLngBounds) => {
            if (isFetchingPoisRef.current) return;

            if (lastFetchedBoundsRef.current) {
                const lastCenter = lastFetchedBoundsRef.current.getCenter();
                const newCenter = bounds.getCenter();
                const threshold = bounds.getSouthWest().distanceTo(bounds.getSouthEast()) * 0.30;
                if (newCenter.distanceTo(lastCenter) < threshold) {
                    return;
                }
            }

            setIsFetchingPois(true);
            try {
                const newPois = await fetchPois(bounds);
                setPois(newPois);
                lastFetchedBoundsRef.current = bounds;
            } catch (error) {
                console.error("Failed to fetch POIs:", error);
            } finally {
                setIsFetchingPois(false);
            }
        }, 1500),
        []
    );

    const handleBoundsChange = useCallback((bounds: L.LatLngBounds, newZoom: number) => {
        setZoom(newZoom);
        
        const minFetchZoom = Math.min(...Object.values(POI_CATEGORY_CONFIG).map(c => c.minZoom));
        
        if (newZoom < minFetchZoom) {
            if (pois.length > 0) setPois([]);
            lastFetchedBoundsRef.current = null;
            return;
        }
        
        debouncedFetchPois(bounds);
    }, [pois.length, debouncedFetchPois]);


    // Effect to filter and de-clutter POIs for rendering
    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        // 1. Filter by current zoom level based on our config
        const zoomFilteredPois = pois.filter(poi => {
            const config = POI_CATEGORY_CONFIG[poi.category];
            // If a category is not in the config, show it at a reasonable zoom
            return config ? zoom >= config.minZoom : zoom > 14;
        });

        // 2. De-clutter based on screen proximity to prevent ugly overlaps
        const acceptedPois: Poi[] = [];
        const screenPoints: L.Point[] = [];
        const minPixelDistance = 60; // Min distance between icons in pixels

        zoomFilteredPois.forEach(poi => {
            const screenPoint = map.latLngToContainerPoint({ lat: poi.lat, lng: poi.lng });
            
            const isTooClose = screenPoints.some(
                p => screenPoint.distanceTo(p) < minPixelDistance
            );

            if (!isTooClose) {
                acceptedPois.push(poi);
                screenPoints.push(screenPoint);
            }
        });

        setVisiblePois(acceptedPois);
    }, [pois, zoom, mapRef]);


    const totalDistance = useMemo(() => {
        if (measurementPoints.length < 2) return 0;
        return measurementPoints.slice(1).reduce((acc, point, i) => acc + calculateDistance(measurementPoints[i], point), 0);
    }, [measurementPoints]);

    const panelLocationData = useMemo(() => {
        if (isInspecting && inspectorData) {
            return { latitude: inspectorData.lat, longitude: inspectorData.lng, altitude: null };
        }
        if (!isInspecting && location) {
            return { latitude: location.latitude, longitude: location.longitude, altitude: location.altitude };
        }
        return null;
    }, [isInspecting, inspectorData, location]);
    
    useEffect(() => {
        if (location && mapRef.current) {
            const initialCenter = mapRef.current.getCenter();
            if (initialCenter.lat.toFixed(4) === '-15.3875' && initialCenter.lng.toFixed(4) === '28.3228') {
                 setMapCenter([location.latitude, location.longitude]); setZoom(16);
            }
        }
    }, [location]);

    const isFavorite = useMemo(() => searchedLocation ? favorites.some(f => f.lat === searchedLocation.lat && f.lng === searchedLocation.lng) : false, [favorites, searchedLocation]);

    return (
        <div className={`relative h-screen w-screen bg-gray-100 text-gray-800 overflow-hidden ${isMeasuring || isInspecting ? 'measuring-cursor' : ''}`}>
            {!isOnline && (
                <div className="absolute top-0 left-0 right-0 bg-amber-500 text-white text-center p-2 z-[1001] shadow-lg animate-pulse">
                    You are currently offline. Map tiles and recent results may be served from cache.
                </div>
            )}
            <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom={true} className="h-full w-full z-0" ref={mapRef}>
                <RecenterMap center={mapCenter} zoom={zoom} />
                <MapEvents onClick={handleMapClick} onMouseMove={handleMouseMove} />
                <TileLayer attribution={MAP_LAYERS[currentLayer].attribution} url={MAP_LAYERS[currentLayer].url} />
                <PoiManager onBoundsChange={handleBoundsChange} />
                
                {location && <Marker position={[location.latitude, location.longitude]} icon={userMarkerIcon}><Popup>You are here.</Popup></Marker>}

                {searchedLocation && (
                    <Marker position={[searchedLocation.lat, searchedLocation.lng]} icon={pinMarkerIcon}>
                        <Popup>
                            <div className="flex flex-col gap-2 w-48">
                                <h3 className="font-bold text-base text-center">{searchedLocation.name}</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={handleRequestDirections} className="text-sm bg-blue-600 text-white px-2 py-2 rounded-lg hover:bg-blue-700 w-full disabled:bg-gray-400" disabled={!location}>
                                        Directions
                                    </button>
                                    <button onClick={() => handleToggleFavorite(searchedLocation)} className="text-sm bg-amber-400 text-white px-2 py-2 rounded-lg hover:bg-amber-500 w-full">
                                        {isFavorite ? 'Saved' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )}
                
                {visiblePois.map((poi, index) => (
                    <Marker key={`${poi.category}-${index}-${poi.lat}`} position={[poi.lat, poi.lng]} icon={poiIcons[poi.category]}>
                        <Popup>
                            <div className="font-bold text-center">{poi.name}</div>
                            <div className="text-sm text-gray-600 text-center capitalize">{poi.category.replace('-', ' ')}</div>
                        </Popup>
                    </Marker>
                ))}

                {isMeasuring && measurementPoints.map((point, index) => <Marker key={index} position={[point.lat, point.lng]} icon={L.divIcon({ className: 'custom-div-icon', html: `<div class="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>`, iconSize: [12, 12], iconAnchor: [6, 6] })} /> )}
                {measurementPoints.length > 1 && <Polyline positions={measurementPoints.map(p => [p.lat, p.lng])} color="#3b82f6" weight={3} />}
                {route && <Polyline positions={route.polyline.map(p => [p.lat, p.lng])} color="#0055ff" weight={5} opacity={0.7} className="route-path" />}
            </MapContainer>

            <ControlPanel
                onSearch={handleSearch}
                onRecenter={handleRecenter}
                onToggleMeasurement={toggleMeasurement}
                isMeasuring={isMeasuring}
                isSearching={isSearching}
                searchError={searchError}
                disableRecenter={!location}
                onSetLayer={setCurrentLayer}
                currentLayer={currentLayer}
                onToggleFavorites={() => setShowFavorites(p => !p)}
                mapLayers={MAP_LAYERS}
                isInspecting={isInspecting}
                onToggleInspector={() => setIsInspecting(p => !p)}
                onToggleAiAssistant={() => setShowAiAssistant(p => !p)}
            />
            
            <BottomPanels
                location={panelLocationData}
                distance={isMeasuring ? totalDistance : null}
                satellites={satellites}
                isInspecting={isInspecting}
            />

            <FavoritesPanel favorites={favorites} isOpen={showFavorites} onClose={() => setShowFavorites(false)} onSelect={handleSelectFavorite} onDelete={handleToggleFavorite} />
            <DirectionsPanel route={route} isOpen={showDirections} onClose={() => setShowDirections(false)} />
            <AiAssistantPanel isOpen={showAiAssistant} onClose={() => setShowAiAssistant(false)} history={chatHistory} onSendQuery={handleAiQuery} isReplying={isAiReplying} />
            {showPermissionsModal && <PermissionsModal onClose={() => setShowPermissionsModal(false)} />}
        </div>
    );
};

export default App;