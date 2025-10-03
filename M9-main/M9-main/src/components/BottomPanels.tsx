import React from 'react';
import type { SatelliteData } from '../types';
import { MyLocationIcon, SatelliteIcon } from './Icons';
import { FloatingPanel } from './FloatingPanel';

interface BottomPanelsProps {
    location: { latitude: number, longitude: number, altitude: number | null } | null;
    distance: number | null;
    satellites: SatelliteData | null;
    isInspecting: boolean;
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

export const BottomPanels: React.FC<BottomPanelsProps> = ({ location, distance, satellites, isInspecting }) => {

    const renderLocationContent = () => {
        if (!location) {
            return <div className="text-center text-gray-500 p-2 animate-pulse">Acquiring signal...</div>;
        }

        return (
             <div className="grid grid-cols-3 gap-2 p-2 text-center">
                <DataField label="Latitude" value={location.latitude.toFixed(5)} />
                <DataField label="Longitude" value={location.longitude.toFixed(5)} />
                <DataField label="Altitude" value={location.altitude?.toFixed(0) ?? 'N/A'} unit={location.altitude ? 'm' : ''} />
            </div>
        );
    };

     const renderSatelliteContent = () => {
        if (!satellites) {
            return <div className="text-center text-gray-500 p-2 animate-pulse">Searching...</div>;
        }
        const constellations = [
            { name: 'GPS', count: satellites.gps },
            { name: 'GLONASS', count: satellites.glonass },
            { name: 'Galileo', count: satellites.galileo },
            { name: 'BeiDou', count: satellites.beidou },
        ];
        const totalSatellites = constellations.reduce((sum, sat) => sum + sat.count, 0);

        return (
            <>
                <h4 className="text-sm font-semibold text-gray-800 text-center mb-2">Total Visible: {totalSatellites}</h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                    {constellations.map(sat => (
                        <div key={sat.name}>
                            <p className="text-xs text-gray-500">{sat.name}</p>
                            <p className="font-bold text-gray-900">{sat.count}</p>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className="absolute bottom-4 inset-x-4 z-10 mx-auto max-w-lg flex flex-col items-center gap-2">
            {distance !== null && (
                <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden p-2 text-center font-bold text-lg w-full">
                    Distance: {distance < 1000 ? `${distance.toFixed(1)} m` : `${(distance / 1000).toFixed(2)} km`}
                </div>
            )}
            <FloatingPanel title={isInspecting ? "Inspector" : "Coordinates"} icon={<MyLocationIcon />}>
                {renderLocationContent()}
            </FloatingPanel>
            <FloatingPanel title="Satellites" icon={<SatelliteIcon className="w-6 h-6 text-gray-700"/>}>
                {renderSatelliteContent()}
            </FloatingPanel>
        </div>
    );
};