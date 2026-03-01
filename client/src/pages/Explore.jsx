import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Filter, Loader2, Navigation, Compass, Sparkles, X } from 'lucide-react';
import { toast } from 'react-toastify';

const PAGE_SIZE = 12;

const Explore = () => {
    const { api } = useAuth();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({ search: '', country: '', state: '', district: '', distance: '', lat: '', lng: '' });
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
        } catch {
            toast.error('Failed to load places');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPlaces(); setCurrentPage(1); }, [filters]);

    const totalPages = Math.ceil(places.length / PAGE_SIZE);
    const paginatedPlaces = places.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

    const getUserLocation = () => {
        if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFilters({ ...filters, lat: pos.coords.latitude, lng: pos.coords.longitude, distance: filters.distance || '50' });
                setIsLocating(false);
                toast.success('Location found!');
            },
            () => { setIsLocating(false); toast.error('Unable to retrieve your location'); }
        );
    };

    const clearLocation = () => setFilters({ ...filters, lat: '', lng: '', distance: '' });
    const activeFilterCount = [filters.search, filters.country, filters.state, filters.lat].filter(Boolean).length;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Page Header — matches DreamPlaces / VisitedPlaces style */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 mb-2">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700">Discover</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        Explore <span className="text-emerald-600">Places</span>
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {places.length} destinations shared by our community
                    </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <Compass className="w-5 h-5" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-slate-100 rounded-xl p-4 sticky top-20 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1.5 text-slate-800">
                                <Filter className="w-4 h-4 text-emerald-500" />
                                <h2 className="text-sm font-bold">Filters</h2>
                            </div>
                            {activeFilterCount > 0 && (
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    {activeFilterCount} active
                                </span>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                    <input type="text" name="search" placeholder="E.g. forest trail" value={filters.search} onChange={handleFilterChange}
                                        className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Country</label>
                                <input type="text" name="country" placeholder="Any country" value={filters.country} onChange={handleFilterChange}
                                    className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">State / Province</label>
                                <input type="text" name="state" placeholder="Any state" value={filters.state} onChange={handleFilterChange}
                                    className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                            </div>

                            {/* Nearby */}
                            <div className="pt-3 border-t border-slate-100">
                                <label className="block text-[10px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">Find Nearby</label>
                                {filters.lat && filters.lng ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs bg-emerald-50 px-3 py-2 rounded-lg">
                                            <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                                <MapPin className="w-3 h-3" /> Location set
                                            </span>
                                            <button onClick={clearLocation} className="text-rose-500 font-semibold flex items-center gap-0.5 text-[10px]">
                                                <X className="w-3 h-3" /> Clear
                                            </button>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                                <span>Distance</span>
                                                <span className="font-semibold text-emerald-600">{filters.distance} km</span>
                                            </div>
                                            <input type="range" name="distance" min="5" max="500" step="5" value={filters.distance} onChange={handleFilterChange}
                                                className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-500" />
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={getUserLocation} disabled={isLocating}
                                        className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all disabled:opacity-60">
                                        {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                                        Use My Location
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Places Grid — compact overlay cards, consistent with VisitedPlaces & DreamPlaces */}
                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                            <p className="text-xs text-slate-400 mt-3 font-medium">Discovering places…</p>
                        </div>
                    ) : places.length === 0 ? (
                        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl py-14 flex flex-col items-center justify-center text-center px-4">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
                                <Compass className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-black text-slate-800 mb-1">No places found</h3>
                            <p className="text-xs text-slate-500 max-w-xs">Try adjusting your filters or share the first place here!</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-xs text-slate-400 font-medium mb-3">
                                <span className="font-bold text-slate-700">{places.length}</span> place{places.length !== 1 ? 's' : ''} · Page {currentPage} of {totalPages}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {paginatedPlaces.map((place) => (
                                    <Link
                                        key={place._id}
                                        to={`/places/${place._id}`}
                                        className="group bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        <div className="aspect-[4/3] relative overflow-hidden">
                                            <img
                                                src={place.photos?.[0] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80'}
                                                alt={place.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent opacity-70" />
                                            <div className="absolute bottom-2 left-2 right-2">
                                                <h3 className="text-xs font-bold text-white leading-tight truncate">{place.name}</h3>
                                                <div className="flex items-center gap-0.5 text-emerald-300 text-[8px] font-semibold uppercase mt-0.5">
                                                    <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                                                    <span className="truncate">{[place.district, place.state, place.country].filter(Boolean).join(', ')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Explore;
