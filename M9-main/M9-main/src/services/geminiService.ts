import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { Point, Route, TravelMode, Poi, PoiCategory, SearchResult } from '../types';
import L from 'leaflet';

const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.error("API_KEY environment variable not set. Gemini API calls will be disabled.");
}


// --- START: OpenStreetMap Nominatim Integration for Search ---
// This uses a free service to avoid spending Gemini API tokens on basic search and autocomplete.

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
// A custom user agent is required by Nominatim's usage policy.
const userAgent = 'Gemini-GPS-Navigator/1.0 (dev.aistudio.google.com)';

interface NominatimResult {
    lat: string;
    lon: string;
    display_name: string;
}

/**
 * Geocodes a location query using the free OpenStreetMap Nominatim API.
 * @param query The location name to search for.
 * @returns A SearchResult object containing the name, latitude, and longitude, or null if not found.
 */
export const geocodeLocation = async (query: string): Promise<SearchResult | null> => {
    try {
        const params = new URLSearchParams({
            q: query,
            format: 'json',
            limit: '1'
        });

        const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params.toString()}`, {
            headers: { 'User-Agent': userAgent }
        });

        if (!response.ok) throw new Error(`Nominatim API returned status ${response.status}`);
        
        const data: NominatimResult[] = await response.json();

        if (data && data.length > 0) {
            const result = data[0];
            return {
                name: result.display_name,
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon)
            };
        }
        return null;
    } catch (error) {
        console.error("Error geocoding with Nominatim:", error);
        throw new Error("Failed to find location using OpenStreetMap.");
    }
};

/**
 * Gets autocomplete suggestions for a location query using the free OpenStreetMap Nominatim API.
 * @param query The partial location name.
 * @returns An array of string suggestions.
 */
export const getAutocompleteSuggestions = async (query: string): Promise<string[]> => {
    if (query.trim().length < 3) return [];
    try {
        const params = new URLSearchParams({
            q: query,
            format: 'json',
            limit: '5'
        });
        
        const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params.toString()}`, {
            headers: { 'User-Agent': userAgent }
        });

        if (!response.ok) return [];

        const data: NominatimResult[] = await response.json();
        return data.map(item => item.display_name) || [];
    } catch (error) {
        console.error("Error getting autocomplete from Nominatim:", error);
        return []; // Return empty array on error for better UX
    }
};

// --- END: OpenStreetMap Nominatim Integration ---


const zambianContext = "Context: The user is likely in Zambia. Be aware of common local place names which may not be in English, such as 'Kulima Tower', 'Nakadoli Market', or 'Chisokone Market'. Prioritize Zambian locations if the query is ambiguous.";

const createApiNotConfiguredError = () => new Error("Gemini API not configured. An API key is required.");

const retryWithBackoff = async <T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000,
    backoffFactor = 2
): Promise<T> => {
    let lastError: Error | unknown;

    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            console.warn(`API call attempt ${i + 1} failed. Retrying in ${delay}ms...`, error);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= backoffFactor;
        }
    }
    throw lastError;
};

export const getDirections = async (start: Point, end: Point, travelMode: TravelMode): Promise<Route | null> => {
    if (!ai) throw createApiNotConfiguredError();
    try {
        const response = await retryWithBackoff<GenerateContentResponse>(() => ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Provide a route for ${travelMode} from ${start.lat},${start.lng} to ${end.lat},${end.lng}. The response should be a JSON object containing the estimated time of arrival (eta) as a string (e.g., "15 mins"), a simplified polyline of the route as an array of lat/lng points, and turn-by-turn steps. Each step should include an instruction, a distance for that step, and the start/end points of the step.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        eta: { type: Type.STRING },
                        polyline: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    lat: { type: Type.NUMBER },
                                    lng: { type: Type.NUMBER }
                                },
                                required: ["lat", "lng"]
                            }
                        },
                        steps: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    instruction: { type: Type.STRING },
                                    distance: { type: Type.STRING },
                                    points: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                lat: { type: Type.NUMBER },
                                                lng: { type: Type.NUMBER }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    required: ["eta", "polyline", "steps"]
                },
            },
        }));

        const text = response.text;
        if (!text) return null;
        const data = JSON.parse(text.trim());

        if (data && data.polyline && Array.isArray(data.polyline)) {
            data.polyline.unshift(start);
            data.polyline.push(end);
            return data as Route;
        }
        
        return null;

    } catch (error) {
        console.error("Error getting directions:", error);
        throw new Error("Failed to get directions from the routing service.");
    }
};

export const getAiAssistantResponse = async (query: string, location: Point | null): Promise<string> => {
    if (!ai) throw createApiNotConfiguredError();
    try {
        const locationContext = location ? `The user's current location is latitude: ${location.lat}, longitude: ${location.lng}.` : "The user's location is not available.";

        const response = await retryWithBackoff<GenerateContentResponse>(() => ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a helpful and concise navigation assistant for a map application. ${locationContext} Answer the user's question: "${query}"`,
             config: {
                systemInstruction: `Your answers should be brief and directly related to navigation, points of interest, or geography. ${zambianContext}`,
            },
        }));

        return response.text ?? '';
    } catch (error) {
        console.error("Error getting AI assistant response:", error);
        throw new Error("Failed to get response from AI assistant.");
    }
};

export const fetchPois = async (bounds: L.LatLngBounds): Promise<Poi[]> => {
    if (!ai) return []; // Don't throw for POIs, just return empty
    try {
        const poiCategories: PoiCategory[] = ['hospital', 'gas-station', 'airport', 'mall', 'bus-stop', 'stadium'];
        const response = await retryWithBackoff<GenerateContentResponse>(() => ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a list of common points of interest within the following geographical bounding box: North-East corner (${bounds.getNorthEast().lat}, ${bounds.getNorthEast().lng}), South-West corner (${bounds.getSouthWest().lat}, ${bounds.getSouthWest().lng}). The points of interest should be of categories: ${poiCategories.join(', ')}. For each POI, provide its name, category, and precise lat/lng coordinates. Provide a maximum of 25 POIs to avoid clutter.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        pois: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    category: { type: Type.STRING, enum: poiCategories },
                                    lat: { type: Type.NUMBER },
                                    lng: { type: Type.NUMBER },
                                },
                                required: ["name", "category", "lat", "lng"],
                            },
                        },
                    },
                    required: ["pois"],
                },
            },
        }));
        const text = response.text;
        if (!text) return [];
        const data = JSON.parse(text.trim());
        return data.pois || [];
    } catch (error) {
        console.error("Error fetching POIs:", error);
        return [];
    }
};