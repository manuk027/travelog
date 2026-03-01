import { useState, useEffect } from 'react';
import PlaceCard from '../components/PlaceCard';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Filter, Loader2, Navigation, Compass, X } from 'lucide-react';
import { toast } from 'react-toastify';

const Explore = () => {
    const { api } = useAuth();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        search: '',
        country: '',
        state: '',
        district: '',
        distance: '',
        lat: '',
        lng: ''
    });

    const [isLocating, setIsLocating] = useState(false);

    const fetchPlaces = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.country) params.append('country', filters.country);
            if (filters.state) params.append('state', filters.state);
            if (filters.district) params.append('district', filters.district);

            if (filters.distance && filters.lat && filters.lng) {
                params.append('distance', filters.distance);
                params.append('lat', filters.lat);
                params.append('lng', filters.lng);
            }

            const res = await api.get(`/places?${params.toString()}`);
            setPlaces(res.data.data.places);
        } catch (error) {
            console.error('Error fetching places:', error);
            toast.error('Failed to load places');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const getUserLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFilters({
                    ...filters,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    distance: filters.distance || '50'
                });
                setIsLocating(false);
                toast.success('Location found! Showing nearby places.');
            },
            () => {
                setIsLocating(false);
                toast.error('Unable to retrieve your location');
            }
        );
    };

    const clearLocation = () => {
        setFilters({ ...filters, lat: '', lng: '', distance: '' });
    };

    const activeFilterCount = [filters.search, filters.country, filters.state, filters.lat].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Page Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-green-50 pt-24 pb-12">
                <div className="absolute inset-0 opacity-[0.08]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-xl bg-emerald-100">
                            <Compass className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                            Explore Places
                        </h1>
                    </div>
                    <p className="text-slate-400 max-w-lg">
                        Discover beautiful travel destinations shared by our community.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-20">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Filter className="w-5 h-5 text-emerald-500" />
                                    <h2 className="text-base font-bold">Filters</h2>
                                </div>
                                {activeFilterCount > 0 && (
                                    <span className="text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-500/10 dark:text-primary-400 px-2 py-0.5 rounded-full">
                                        {activeFilterCount} active
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">
                                {/* Search */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="search"
                                            placeholder="E.g. Eiffel Tower"
                                            value={filters.search}
                                            onChange={handleFilterChange}
                                            className="input-field pl-10 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        placeholder="Any country"
                                        value={filters.country}
                                        onChange={handleFilterChange}
                                        className="input-field text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                        State / Province
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="Any state"
                                        value={filters.state}
                                        onChange={handleFilterChange}
                                        className="input-field text-sm"
                                    />
                                </div>

                                {/* Nearby Geo Filter */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60">
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5 uppercase tracking-wider">
                                        Find Nearby
                                    </label>

                                    {filters.lat && filters.lng ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2.5 rounded-xl">
                                                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                                                    <MapPin className="w-4 h-4" /> Location Set
                                                </span>
                                                <button onClick={clearLocation} className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1">
                                                    <X className="w-3 h-3" /> Clear
                                                </button>
                                            </div>

                                            <div>
                                                <div className="flex justify-between text-xs text-slate-400 mb-1">
                                                    <span>Distance</span>
                                                    <span className="font-semibold text-primary-500">{filters.distance} km</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    name="distance"
                                                    min="5"
                                                    max="500"
                                                    step="5"
                                                    value={filters.distance}
                                                    onChange={handleFilterChange}
                                                    className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-500 dark:bg-slate-700"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={getUserLocation}
                                            disabled={isLocating}
                                            className="w-full btn-secondary flex items-center justify-center gap-2 text-sm"
                                        >
                                            {isLocating ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Navigation className="w-4 h-4" />
                                            )}
                                            Use My Location
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Places Grid */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-80">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full border-4 border-primary-100 dark:border-primary-900/40 border-t-primary-500 animate-spin" />
                                </div>
                                <p className="text-sm text-slate-400 mt-5 font-medium">Discovering places...</p>
                            </div>
                        ) : places.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-80 text-center">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center mb-5">
                                    <Compass className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No places found</h3>
                                <p className="text-sm text-slate-400 mt-2 max-w-xs">
                                    Try adjusting your filters or be the first to share a place in this area!
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-sm text-slate-400 font-medium">
                                        <span className="font-bold text-slate-700 dark:text-slate-200">{places.length}</span> place{places.length !== 1 ? 's' : ''} found
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {places.map((place) => (
                                        <PlaceCard key={place._id} place={place} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Explore;
