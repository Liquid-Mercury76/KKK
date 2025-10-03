import React from 'react';

const iconClass = "w-6 h-6";
const activeClass = "text-blue-600";
const inactiveClass = "text-gray-700";
const poiIconClass = "w-5 h-5 text-gray-700";

export const SearchIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

export const NavigationArrowIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={iconClass}>
        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
    </svg>
);

export const RulerIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
    </svg>
);

export const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export const InfoIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || iconClass}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);

export const SatelliteIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || iconClass}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);

export const LayersIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l.09-.09a2.25 2.25 0 013.06 0l1.59 1.59a2.25 2.25 0 003.06 0l4.5-4.5a2.25 2.25 0 013.06 0l1.59 1.59a2.25 2.25 0 003.06 0l.09-.09" />
    </svg>
);

export const BookmarkIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
);

export const CloseIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const MyLocationIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={iconClass}>
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
    </svg>
);

export const ChevronUpIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    </svg>
);

export const ChevronDownIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

export const InspectIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 3a.75.75 0 0 1 .75.75v16.5a.75.75 0 0 1-1.5 0V3.75A.75.75 0 0 1 10.5 3Z" clipRule="evenodd" />
    </svg>
);

export const CarIcon: React.FC<{isActive?: boolean}> = ({isActive}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${iconClass} ${isActive ? activeClass : inactiveClass}`}>
        <path fillRule="evenodd" d="M4.5 3.75A3 3 0 0 0 1.5 6.75v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a.75.75 0 0 0 0 1.5h6.75a.75.75 0 0 0 0-1.5h-6.75ZM2.25 9.75a.75.75 0 0 1 .75-.75h18a.75.75 0 0 1 0 1.5h-18a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h18a.75.75 0 0 0 0-1.5h-18Z" clipRule="evenodd" />
    </svg>
);

export const BikeIcon: React.FC<{isActive?: boolean}> = ({isActive}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${iconClass} ${isActive ? activeClass : inactiveClass}`}>
        <path d="M6.5 13.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm11 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path fillRule="evenodd" d="M22.5 13.5a3.5 3.5 0 1 0-7 0 3.5 3.5 0 0 0 7 0ZM5.5 13.5a3.5 3.5 0 1 0-7 0 3.5 3.5 0 0 0 7 0Zm.34-4.234a.75.75 0 0 0-1.062-1.06L2.62 10.365l-.5-.5a.75.75 0 0 0-1.06 1.06l1 1a.75.75 0 0 0 1.06 0l2.719-2.72ZM19.66 8.206a.75.75 0 0 0-1.061 1.06l2.158 2.159.5.5a.75.75 0 0 0 1.06-1.06l-1-1a.75.75 0 0 0-1.06 0l-.596.597ZM8.63 4.67a.75.75 0 0 1 1.082-.99l4.5 4.909a.75.75 0 0 1-1.082.99l-4.5-4.909Z" clipRule="evenodd" />
    </svg>
);

export const WalkIcon: React.FC<{isActive?: boolean}> = ({isActive}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${iconClass} ${isActive ? activeClass : inactiveClass}`}>
        <path fillRule="evenodd" d="M8.25 3.75a.75.75 0 0 1 .75.75v.43l1.9-2.145a.75.75 0 1 1 1.11 1.004l-1.9 2.145h.34a.75.75 0 0 1 0 1.5H8.25v2.25h1.5a.75.75 0 0 1 0 1.5H8.25V15h3a.75.75 0 0 1 0 1.5H9.75v3.75a.75.75 0 0 1-1.5 0V12h-1.5a.75.75 0 0 1 0-1.5h1.5V8.25H6a.75.75 0 0 1 0-1.5h3.75V3.75ZM13.5 6a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
        <path d="M12.75 2.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
    </svg>
);

export const EtaIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const StepIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
    </svg>
);

export const SparklesIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

export const PaperAirplaneIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);

export const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

// POI Icons
export const HospitalIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="${poiIconClass} text-red-500"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" clip-rule="evenodd" /></svg>`;
export const GasStationIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="${poiIconClass} text-blue-500"><path fill-rule="evenodd" d="M15.988 3.012A2.25 2.25 0 0 0 15.336 3H9.75a.75.75 0 0 0 0 1.5h5.586l-2.292 2.293a.75.75 0 0 0 1.06 1.061L17.25 5.707V11.25a.75.75 0 0 0 1.5 0V4.664a2.25 2.25 0 0 0-.012-.652Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M5.524 2.476a.75.75 0 0 1 .652.882l-1.5 6A.75.75 0 0 1 4 9.75H2.25a.75.75 0 0 1 0-1.5H3.5l1.04-4.16a.75.75 0 0 1 .984-.514ZM2.25 12a.75.75 0 0 0 0 1.5h.75v1.5a.75.75 0 0 0 1.5 0v-1.5h.75a.75.75 0 0 0 0-1.5h-3Z" clip-rule="evenodd" /></svg>`;
export const AirportIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="${poiIconClass} text-purple-500"><path d="M10.75 10.418 5.423 13.9a.75.75 0 0 1-1.035-.86l3.53-7.523.018-.039.002-.004a.75.75 0 0 1 .48-.48l.004-.002.04-.018 7.522-3.53a.75.75 0 0 1 .86 1.036l-3.5 5.325Z" /><path d="m11.168 11.168 4.782 1.063a.75.75 0 0 1 .616.896l-.98 4.409a.75.75 0 0 1-1.425-.316l.865-3.891-3.796-.843a.75.75 0 0 1-.58-.58l-.843-3.796-3.891.865a.75.75 0 0 1-.316-1.425l4.41-.98a.75.75 0 0 1 .896.616Z" /></svg>`;
export const MallIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="${poiIconClass} text-green-500"><path fill-rule="evenodd" d="M4 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4Zm9.5 4a.5.5 0 0 0-.5-.5H11a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5ZM6.5 6A.5.5 0 0 0 6 6.5v8a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V12a.5.5 0 0 0-1 0v2.5H7V6.5A.5.5 0 0 0 6.5 6Z" clip-rule="evenodd" /></svg>`;
export const BusStopIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="${poiIconClass} text-amber-500"><path fill-rule="evenodd" d="M1 4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2h-2v10h2v2H3v-2h2V6H1V4Zm13.5 0A1.5 1.5 0 0 0 13 5.5v1.75a.75.75 0 0 0 1.5 0V5.5A1.5 1.5 0 0 0 14.5 4ZM5.5 4A1.5 1.5 0 0 0 4 5.5v1.75a.75.75 0 0 0 1.5 0V5.5A1.5 1.5 0 0 0 5.5 4ZM4 16v-5h12v5H4Z" clip-rule="evenodd" /></svg>`;
export const StadiumIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="${poiIconClass} text-cyan-500"><path d="M1 10a9 9 0 0 1 9-9h.01c.03 0 .06.002.09.006.05.006.09.014.12.022a1.75 1.75 0 0 1 1.56 2.2l-2.4 6.857a.75.75 0 0 0 .914 1.01l.42-.153a1.75 1.75 0 0 1 2.053.442l1.62 1.62a1.75 1.75 0 0 1-2.474 2.474l-1.62-1.62a1.75 1.75 0 0 1-.442-2.053l.153-.42a.75.75 0 0 0-1.01-.914l-6.857 2.4A1.75 1.75 0 0 1 2.924 16.2c-.008-.03-.016-.07-.022-.12a.016.016 0 0 0-.006-.09C1.002 10.06 1 10.03 1 10Z" /></svg>`;
