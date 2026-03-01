import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Search, MapPin, Loader2, Leaf } from 'lucide-react';
import { toast } from 'react-toastify';

const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '350px',
    borderRadius: '1.5rem'
};
const defaultCenter = {
    lat: 20.5937, // Default center (India)
    lng: 78.9629
};

const LocationPicker = ({ onLocationSelect }) => {
    const [marker, setMarker] = useState(null);
    const [plusCode, setPlusCode] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [map, setMap] = useState(null);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries,
    });

    const onMapLoad = useCallback((mapInstance) => {
        setMap(mapInstance);
    }, []);

    const handleLocationChange = useCallback((lat, lng, code = '') => {
        setMarker({ lat, lng });
        if (code) setPlusCode(code);
        onLocationSelect({ lat, lng, plusCode: code || plusCode });
    }, [onLocationSelect, plusCode]);

    const onMapClick = useCallback((e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        // Reverse geocode to get plus code
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            let foundPlusCode = '';
            if (status === 'OK' && results[0]) {
                // Look for plus_code in the response
                const pc = results.find(r => r.types.includes('plus_code'));
                if (pc) {
                    foundPlusCode = pc.plus_code?.global_code || '';
                }
            }
            handleLocationChange(lat, lng, foundPlusCode);
        });
    }, [handleLocationChange]);

    const searchPlusCode = async (e) => {
        e.preventDefault();
        if (!plusCode.trim()) return;

        if (!window.google || !window.google.maps) {
            toast.error('Google Maps API not loaded. Cannot search Plus Codes.');
            return;
        }

        setIsSearching(true);
        try {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: plusCode }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const { lat, lng } = results[0].geometry.location;
                    const newLocation = { lat: lat(), lng: lng() };

                    handleLocationChange(newLocation.lat, newLocation.lng);
                    if (map) {
                        map.panTo(newLocation);
                        map.setZoom(15);
                    }
                    toast.success('Location found!');
                } else {
                    toast.error('Could not find location for this Plus Code.');
                }
                setIsSearching(false);
            });
        } catch (error) {
            console.error('Geocoding error:', error);
            toast.error('Error searching for Plus Code.');
            setIsSearching(false);
        }
    };

    const getAnimation = () => {
        return (window.google && window.google.maps && window.google.maps.Animation)
            ? window.google.maps.Animation.DROP
            : null;
    };

    if (loadError) return (
        <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2rem] text-center space-y-3">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mx-auto">
                <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800">Map Loading Failed</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
                We couldn't initialize the map. This might be due to an invalid API key or connection issues.
            </p>
            <div className="pt-2">
                <p className="text-[10px] text-slate-400 font-mono break-all">{loadError.message}</p>
            </div>
        </div>
    );

    if (!isLoaded) return (
        <div className="h-[400px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded-[2.5rem] border border-slate-100 animate-pulse">
            <div className="relative">
                <div className="w-12 h-12 rounded-2xl border-2 border-emerald-100 border-t-emerald-500 animate-spin" />
                <MapPin className="absolute inset-0 m-auto w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-slate-400 font-bold tracking-tight">Initializing Map Space...</p>
        </div>
    );

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Plus Code Input */}
            <form onSubmit={searchPlusCode} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                    type="text"
                    value={plusCode}
                    onChange={(e) => setPlusCode(e.target.value)}
                    placeholder="Enter Plus Code (e.g. 7JCM+H8J, London)"
                    className="block w-full pl-11 pr-24 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                />
                <button
                    type="submit"
                    disabled={isSearching || !plusCode.trim()}
                    className="absolute right-2 top-2 bottom-2 px-4 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                </button>
            </form>

            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-inner group">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={marker ? 15 : 4}
                    center={marker || defaultCenter}
                    onClick={onMapClick}
                    onLoad={onMapLoad}
                    options={{
                        disableDefaultUI: false,
                        zoomControl: true,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: true,
                        styles: [
                            {
                                "featureType": "administrative",
                                "elementType": "geometry",
                                "stylers": [{ "visibility": "off" }]
                            },
                            {
                                "featureType": "poi",
                                "stylers": [{ "visibility": "off" }]
                            },
                        ]
                    }}
                >
                    {marker && <Marker position={marker} animation={getAnimation()} />}
                </GoogleMap>

                {!marker && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-slate-900/5 backdrop-blur-[1px]">
                        <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg border border-white flex items-center gap-2 animate-bounce">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-bold text-slate-800">Tap to drop a pin</span>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-[11px] text-slate-400 font-medium px-2 flex items-center gap-1.5">
                <Leaf className="w-3 h-3 text-emerald-500" />
                Select a location to share its beauty with the traveLog community.
            </p>
        </div>
    );
};

export default LocationPicker;
