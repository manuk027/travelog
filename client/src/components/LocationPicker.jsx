import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Search, MapPin, Loader2, Leaf, X } from 'lucide-react';
import { toast } from 'react-toastify';

const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '350px',
    borderRadius: '1.5rem'
};
const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629
};

const LocationPicker = ({ onLocationSelect }) => {
    const [marker, setMarker] = useState(null);
    const [map, setMap] = useState(null);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);
    const debounceTimer = useRef(null);
    const geocoder = useRef(null);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries,
    });

    // Initialise geocoder once Maps API is loaded (for reverse geocode on map click)
    useEffect(() => {
        if (isLoaded && window.google) {
            geocoder.current = new window.google.maps.Geocoder();
        }
    }, [isLoaded]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                searchRef.current && !searchRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onMapLoad = useCallback((mapInstance) => {
        setMap(mapInstance);
    }, []);

    const handleLocationChange = useCallback((lat, lng) => {
        setMarker({ lat, lng });
        onLocationSelect({ lat, lng });
    }, [onLocationSelect]);

    // Reverse geocode on map click using Google Geocoder (works without Places billing)
    const onMapClick = useCallback((e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        handleLocationChange(lat, lng);

        if (geocoder.current) {
            geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    setQuery(results[0].formatted_address);
                }
            });
        }
    }, [handleLocationChange]);

    // Search using Nominatim (OpenStreetMap) — free, no API key needed
    const handleQueryChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (!value.trim()) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=6&addressdetails=1`,
                    { headers: { 'Accept-Language': 'en' } }
                );
                const data = await res.json();
                if (data && data.length > 0) {
                    setSuggestions(data);
                    setShowDropdown(true);
                } else {
                    setSuggestions([]);
                    setShowDropdown(false);
                }
            } catch {
                setSuggestions([]);
                setShowDropdown(false);
            } finally {
                setIsSearching(false);
            }
        }, 400);
    };

    // When user selects a Nominatim result, pan the map and drop a pin
    const handleSelectSuggestion = (place) => {
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);
        setQuery(place.display_name);
        setSuggestions([]);
        setShowDropdown(false);
        handleLocationChange(lat, lng);
        if (map) {
            map.panTo({ lat, lng });
            map.setZoom(15);
        }
        toast.success('Location pinned!');
    };

    const clearSearch = () => {
        setQuery('');
        setSuggestions([]);
        setShowDropdown(false);
    };

    // Helper: get short label from Nominatim result
    const getMainText = (place) => {
        const addr = place.address || {};
        return (
            addr.tourism ||
            addr.amenity ||
            addr.leisure ||
            addr.natural ||
            addr.city ||
            addr.town ||
            addr.village ||
            addr.suburb ||
            place.display_name.split(',')[0]
        );
    };

    const getSecondaryText = (place) => {
        const parts = place.display_name.split(',');
        return parts.slice(1, 4).join(',').trim();
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
            {/* Place Search Input with Nominatim Autocomplete Dropdown */}
            <div className="relative group">
                <div ref={searchRef} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        {isSearching
                            ? <Loader2 className="h-4 w-4 text-emerald-500 animate-spin" />
                            : <Search className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        }
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={handleQueryChange}
                        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                        placeholder="Search for a place (e.g. Taj Mahal, Paris, Bali...)"
                        className="block w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                        autoComplete="off"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {showDropdown && suggestions.length > 0 && (
                    <div
                        ref={dropdownRef}
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                        {suggestions.map((place) => (
                            <button
                                key={place.place_id}
                                type="button"
                                onClick={() => handleSelectSuggestion(place)}
                                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-left group/item border-b border-slate-100 dark:border-slate-700 last:border-0"
                            >
                                <div className="mt-0.5 p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg shrink-0 group-hover/item:bg-emerald-100 dark:group-hover/item:bg-emerald-900/40 transition-colors">
                                    <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover/item:text-emerald-600 transition-colors" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                                        {getMainText(place)}
                                    </p>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                        {getSecondaryText(place)}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

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
                            <span className="text-xs font-bold text-slate-800">Search above or tap to drop a pin</span>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-[11px] text-slate-400 font-medium px-2 flex items-center gap-1.5">
                <Leaf className="w-3 h-3 text-emerald-500" />
                Search for a place or tap anywhere on the map to set the location.
            </p>
        </div>
    );
};

export default LocationPicker;
