export interface Point {
    lat: number;
    lng: number;
}

export interface SearchResult extends Point {
    name: string;
}

export interface GeolocationData {
    latitude: number;
    longitude: number;
    altitude: number | null;
    speed: number | null;
    heading: number | null;
    accuracy: number;
}

export interface SatelliteData {
    gps: number;
    glonass: number;
    galileo: number;
    beidou: number;
}

export interface DirectionStep {
    instruction: string;
    distance: string;
    points: Point[];
}

export interface Route {
    polyline: Point[];
    eta: string;
    steps: DirectionStep[];
}

export interface Favorite extends SearchResult {}

export type MapLayerId = 'light' | 'dark' | 'satellite';

export interface LayerConfig {
    id: MapLayerId;
    name: string;
    url: string;
    attribution: string;
}

export type TravelMode = 'drive' | 'walk' | 'bicycle';

export interface ChatMessage {
    role: 'user' | 'ai';
    text: string;
}

export type PoiCategory = 'hospital' | 'gas-station' | 'airport' | 'mall' | 'bus-stop' | 'stadium' | 'traffic-light';

export interface Poi {
    name: string;
    category: PoiCategory;
    lat: number;
    lng: number;
}
