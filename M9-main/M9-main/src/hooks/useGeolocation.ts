import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import type { GeolocationData } from '../types';

export const useGeolocation = () => {
    const [location, setLocation] = useState<GeolocationData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let watchId: string | null = null;

        const startWatch = async () => {
            try {
                // Check for permissions first
                const permissions = await Geolocation.checkPermissions();
                if (permissions.location !== 'granted' && permissions.coarseLocation !== 'granted') {
                    const permissionStatus = await Geolocation.requestPermissions({ permissions: ['location'] });
                    if (permissionStatus.location !== 'granted' && permissionStatus.coarseLocation !== 'granted') {
                        setError('Location access was denied. Please enable it in your device settings.');
                        return;
                    }
                }

                // Start watching position
                watchId = await Geolocation.watchPosition(
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0,
                    },
                    (position, err) => {
                        if (err) {
                            setError(err.message || 'An unknown error occurred while watching position.');
                            return;
                        }
                        
                        if (position) {
                            const { latitude, longitude, altitude, speed, heading, accuracy } = position.coords;
                            setLocation({
                                latitude,
                                longitude,
                                altitude,
                                speed: speed ?? null, // Capacitor's speed can be null
                                heading: heading ?? null, // Capacitor's heading can be null
                                accuracy
                            });
                            setError(null);
                        }
                    }
                );
            } catch (e: any) {
                 setError(e.message || 'Failed to initialize geolocation.');
            }
        };

        startWatch();

        return () => {
            if (watchId) {
                Geolocation.clearWatch({ id: watchId });
            }
        };
    }, []);

    return { location, error };
};