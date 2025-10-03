import { GoogleGenAI, Type } from "@google/genai";
import type { Point, Route, TravelMode, Poi, PoiCategory } from '../types';
import L from 'leaflet';


// Fix: Use process.env.API_KEY to access the API key as per the coding guidelines.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // Fix: Update warning message to reflect the correct environment variable.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const zambianContext = "Context: The user is likely in Zambia. Be aware of common local place names which may not be in English, such as 'Kulima Tower', 'Nakadoli Market', or 'Chisokone Market'. Prioritize Zambian locations if the query is ambiguous.";


export const geocodeLocation = async (locationName: string): Promise<Point | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Find the precise latitude and longitude for: "${locationName}". ${zambianContext}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        lat: { type: Type.NUMBER, description: 'Latitude' },
                        lng: { type: Type.NUMBER, description: 'Longitude' }
                    },
                    required: ["lat", "lng"],
                },
            },
        });

        const data = JSON.parse(response.text.trim());
        return (typeof data.lat === 'number' && typeof data.lng === 'number') ? { lat: data.lat, lng: data.lng } : null;

    } catch (error) {
        console.error("Error geocoding location:", error);
        throw new Error("Failed to communicate with the geocoding service.");
    }
};

export const getDirections = async (start: Point, end: Point, travelMode: TravelMode): Promise<Route | null> => {
    try {
        const response = await ai.models.generateContent({
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
        });

        const data = JSON.parse(response.text.trim());

        if (data && data.polyline && Array.isArray(data.polyline)) {
            // Ensure the route polyline includes the absolute start and end for a complete line
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

export const getAutocompleteSuggestions = async (query: string): Promise<string[]> => {
    if (query.trim().length < 3) {
        return [];
    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Provide up to 5 real-world location autocomplete suggestions for the search query: "${query}". Respond ONLY with a JSON object containing a "suggestions" key with an array of strings. For example: {"suggestions": ["Paris, France", "Paris, Texas, USA"]}. ${zambianContext}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["suggestions"],
                },
                thinkingConfig: { thinkingBudget: 0 } // Faster response for autocomplete
            },
        });
        const data = JSON.parse(response.text.trim());
        return data.suggestions || [];
    } catch (error) {
        console.error("Error getting autocomplete suggestions:", error);
        return []; // Return empty array on error for better UX
    }
};

export const getAiAssistantResponse = async (query: string, location: Point | null): Promise<string> => {
    try {
        const locationContext = location ? `The user's current location is latitude: ${location.lat}, longitude: ${location.lng}.` : "The user's location is not available.";

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a helpful and concise navigation assistant for a map application. ${locationContext} Answer the user's question: "${query}"`,
             config: {
                systemInstruction: `Your answers should be brief and directly related to navigation, points of interest, or geography. ${zambianContext}`,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error getting AI assistant response:", error);
        throw new Error("Failed to get response from AI assistant.");
    }
};

export const fetchPois = async (bounds: L.LatLngBounds): Promise<Poi[]> => {
    try {
        const poiCategories: PoiCategory[] = ['hospital', 'gas-station', 'airport', 'mall', 'bus-stop', 'stadium'];
        const response = await ai.models.generateContent({
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
        });
        const data = JSON.parse(response.text.trim());
        return data.pois || [];
    } catch (error) {
        console.error("Error fetching POIs:", error);
        return [];
    }
};