
import React from 'react';
import type { GeolocationData, SatelliteData } from '../types';
import { SatelliteIcon } from './Icons';

interface LocationDisplayProps {
    location: GeolocationData | null;
    error: string | null;
    distance: number | null;
    satellites: SatelliteData | null;
}

const DataField: React.FC<{ label: string; value: string | number; unit?: string }> = ({ label, value, unit }) => (
    <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</span>
        <span className="text-lg font-semibold text-gray-900">
            {value}
            {unit && <span className="text-sm font-normal text-gray-600 ml-1">{unit}</span>}
        </span>
    </div>
);

const SatelliteDisplay: React.FC<{ satellites: SatelliteData | null }> = ({ satellites }) => {
    if (!satellites) return null;

    const constellations = [
        { name: 'GPS', count: satellites.gps },
        { name: 'GLONASS', count: satellites.glonass },
        { name: 'Galileo', count: satellites.galileo },
        { name: 'BeiDou', count: satellites.beidou },
    ];
    
    const totalSatellites = constellations.reduce((sum, sat) => sum + sat.count, 0);

    return (
        <div className="px-4 pt-3 pb-2 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-2">
                <SatelliteIcon className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-800 text-center">
                    Visible Satellites: {totalSatellites}
                </h3>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
                {constellations.map(sat => (
                    <div key={sat.name}>
                        <p className="text-xs text-gray-500">{sat.name}</p>
                        <p className="font-bold text-gray-900">{sat.count}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const LocationDisplay: React.FC<LocationDisplayProps> = ({ location, error, distance, satellites }) => {
    const renderContent = () => {
        if (error && !error.includes('denied')) { // Don't show redundant error if modal is shown
            return <div className="text-center text-red-600 p-4">{error}</div>;
        }

        if (!location) {
            return <div className="text-center text-gray-500 p-4 animate-pulse">Acquiring GPS signal...</div>;
        }

        return (
            <div className="grid grid-cols-3 gap-4 p-4 text-center">
                <DataField label="Latitude" value={location.latitude.toFixed(5)} />
                <DataField label="Longitude" value={location.longitude.toFixed(5)} />
                <DataField label="Altitude" value={location.altitude?.toFixed(0) ?? 'N/A'} unit={location.altitude ? 'm' : ''} />
                <DataField label="Speed" value={location.speed?.toFixed(1) ?? 'N/A'} unit={location.speed ? 'm/s' : ''} />
                <DataField label="Heading" value={location.heading?.toFixed(0) ?? 'N/A'} unit={location.heading ? '°' : ''} />
                <DataField label="Accuracy" value={location.accuracy?.toFixed(0)} unit="m" />
            </div>
        );
    };

    return (
        <div className="absolute bottom-4 inset-x-4 z-10 mx-auto max-w-lg">
             <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                {distance !== null && (
                    <div className="bg-green-500 text-white p-2 text-center font-bold text-lg">
                        Distance: {distance < 1000 ? `${distance.toFixed(1)} m` : `${(distance / 1000).toFixed(2)} km`}
                    </div>
                )}
                {renderContent()}
                <SatelliteDisplay satellites={satellites} />
            </div>
        </div>
    );
};
