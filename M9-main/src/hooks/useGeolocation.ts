import { useState, useEffect } from 'react';
import type { GeolocationData } from '../types';

export const useGeolocation = () => {
    const [location, setLocation] = useState<GeolocationData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, altitude, speed, heading, accuracy } = position.coords;
                setLocation({
                    latitude,
                    longitude,
                    altitude,
                    speed,
                    heading,
                    accuracy
                });
                setError(null);
            },
            (err) => {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError('Location access was denied. Please enable it in your browser settings.');
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError('Location information is unavailable.');
                        break;
                    case err.TIMEOUT:
                        setError('The request to get user location timed out.');
                        break;
                    default:
                        setError('An unknown error occurred.');
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return { location, error };
};