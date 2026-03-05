import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { MapPin, Loader2, Map as MapIcon, Globe, Sparkles, Trash2, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 12;

const VisitedPlaces = () => {
    const { api } = useAuth();
    const [loading, setLoading] = useState(true);
    const [visitedPlaces, setVisitedPlaces] = useState([]);
    const [search, setSearch] = useState('');
    const [filterCountry, setFilterCountry] = useState('');
    const [filterState, setFilterState] = useState('');
    const [filterDistrict, setFilterDistrict] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchVisitedPlaces = async () => {
            try {
                const res = await api.get('/users/me');
                setVisitedPlaces(res.data.data.user.visitedPlaces || []);
            } catch (error) {
                toast.error('Failed to fetch visited places');
            } finally {
                setLoading(false);
            }
        };
        fetchVisitedPlaces();
    }, [api]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    const handleRemoveVisited = async (e, placeId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.post(`/users/toggle-visited/${placeId}`);
            setVisitedPlaces((prev) => prev.filter((p) => p._id !== placeId));
            toast.success('Removed from Visited Places');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove place');
        }
    };

    const filtered = visitedPlaces.filter(p => {
        const q = search.toLowerCase();
        return (
            (!search || p.name?.toLowerCase().includes(q) || p.district?.toLowerCase().includes(q)) &&
            (!filterCountry || p.country?.toLowerCase().includes(filterCountry.toLowerCase())) &&
            (!filterState || p.state?.toLowerCase().includes(filterState.toLowerCase())) &&
            (!filterDistrict || p.district?.toLowerCase().includes(filterDistrict.toLowerCase()))
        );
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const resetFilters = () => { setSearch(''); setFilterCountry(''); setFilterState(''); setFilterDistrict(''); setCurrentPage(1); };
    const hasFilters = search || filterCountry || filterState || filterDistrict;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 mb-2">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">My Journey</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Visited <span className="text-emerald-600">Places</span>
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {visitedPlaces.length} explored · {filtered.length} shown
                    </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                    <Globe className="w-5 h-5" />
                </div>
            </div>

            {/* Filter bar */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-2.5 mb-5 flex flex-wrap gap-2 items-center shadow-sm">
                <div className="relative flex-1 min-w-[150px]">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name…"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                </div>
                <input type="text" placeholder="Country…" value={filterCountry}
                    onChange={e => { setFilterCountry(e.target.value); setCurrentPage(1); }}
                    className="flex-1 min-w-[100px] px-3 py-1.5 text-sm rounded-lg border border-slate-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                <input type="text" placeholder="State…" value={filterState}
                    onChange={e => { setFilterState(e.target.value); setCurrentPage(1); }}
                    className="flex-1 min-w-[110px] px-3 py-1.5 text-sm rounded-lg border border-slate-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                <input type="text" placeholder="District…" value={filterDistrict}
                    onChange={e => { setFilterDistrict(e.target.value); setCurrentPage(1); }}
                    className="flex-1 min-w-[110px] px-3 py-1.5 text-sm rounded-lg border border-slate-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                {hasFilters && (
                    <button onClick={resetFilters} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all">
                        <X className="w-3.5 h-3.5" /> Clear
                    </button>
                )}
            </div>

            {filtered.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {paginated.map((place) => (
                            <Link
                                key={place._id}
                                to={`/places/${place._id}`}
                                className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <img
                                        src={place.photos?.[0] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80'}
                                        alt={place.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent opacity-70" />
                                    <button
                                        onClick={(e) => handleRemoveVisited(e, place._id)}
                                        className="absolute top-2 right-2 p-1.5 bg-black/20 hover:bg-rose-500 backdrop-blur-sm rounded-full text-white transition-all z-10"
                                        title="Remove"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                    <div className="absolute bottom-2 left-2 right-2">
                                        <h3 className="text-xs font-bold text-white leading-tight truncate">{place.name}</h3>
                                        <div className="flex items-center gap-0.5 text-emerald-300 text-[8px] font-semibold uppercase mt-0.5">
                                            <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                                            <span className="truncate">{place.district}, {place.state}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            ) : (
                <div className="bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl py-14 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl shadow-sm flex items-center justify-center text-slate-300 dark:text-slate-500 mb-4 border border-slate-100 dark:border-slate-600">
                        <MapIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-black text-slate-800 dark:text-white mb-1">
                        {hasFilters ? 'No matches found' : 'No visited places'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-5">
                        {hasFilters ? 'Try different filters.' : 'Start your journey by exploring and marking locations.'}
                    </p>
                    {hasFilters ? (
                        <button onClick={resetFilters} className="px-5 py-2 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-lg transition-all">
                            Clear Filters
                        </button>
                    ) : (
                        <Link to="/explore" className="px-5 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-all">
                            Start Exploring
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default VisitedPlaces;
