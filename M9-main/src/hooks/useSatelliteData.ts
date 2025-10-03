import { useState, useEffect } from 'react';
import type { SatelliteData } from '../types';

// Mock fetching from an API like /api/gnss-status
const fetchSatelliteData = (): Promise<SatelliteData> => {
    return new Promise(resolve => {
        // Simulate network delay
        setTimeout(() => {
            const data: SatelliteData = {
                gps: Math.floor(Math.random() * 6) + 7, // 7-12
                glonass: Math.floor(Math.random() * 5) + 5, // 5-9
                galileo: Math.floor(Math.random() * 5) + 4, // 4-8
                beidou: Math.floor(Math.random() * 4) + 3, // 3-6
            };
            resolve(data);
        }, 300);
    });
};

export const useSatelliteData = (intervalMs: number = 2000) => {
    const [satellites, setSatellites] = useState<SatelliteData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const updateData = async () => {
            try {
                const data = await fetchSatelliteData();
                setSatellites(data);
                setError(null);
            } catch (err) {
                setError("Could not fetch satellite data.");
                console.error(err);
            }
        };

        updateData(); // Initial fetch
        const intervalId = setInterval(updateData, intervalMs);

        return () => {
            clearInterval(intervalId);
        };
    }, [intervalMs]);

    return { satellites, error };
};