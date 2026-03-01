import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '400px',
    borderRadius: '0.75rem'
};

const MapViewer = ({ lat, lng }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries,
    });

    if (loadError) return <div className="text-rose-500 p-4 bg-rose-50 rounded-xl">Error loading maps. Check API key.</div>;
    if (!isLoaded) return <div className="text-slate-500 p-4 bg-slate-50 rounded-xl animate-pulse h-[400px]">Loading Map...</div>;

    const center = { lat, lng };

    return (
        <div className="w-full h-full rounded-xl overflow-hidden shadow-soft dark:shadow-soft-dark border border-slate-200 dark:border-slate-800">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={12}
                center={center}
                options={{
                    mapTypeControl: false,
                    streetViewControl: false,
                    styles: [
                        // Minimal light/dark styling could go here
                    ]
                }}
            >
                <Marker position={center} />
            </GoogleMap>
        </div>
    );
};

export default MapViewer;
