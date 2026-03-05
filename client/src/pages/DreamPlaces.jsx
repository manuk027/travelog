import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { MapPin, Loader2, Map as MapIcon, Heart, Sparkles, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 12;

const DreamPlaces = () => {
    const { api } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dreamPlaces, setDreamPlaces] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchDreamPlaces = async () => {
            try {
                const res = await api.get('/users/me');
                setDreamPlaces(res.data.data.user.dreamPlaces || []);
            } catch (error) {
                toast.error('Failed to fetch dream places');
            } finally {
                setLoading(false);
            }
        };
        fetchDreamPlaces();
    }, [api]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
            </div>
        );
    }

    const handleRemoveDream = async (e, placeId) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await api.post(`/users/toggle-dream/${placeId}`);
            setDreamPlaces((prev) => prev.filter((p) => p._id !== placeId));
            toast.success("Removed from Dream Places");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove dream place");
        }
    };

    const totalPages = Math.ceil(dreamPlaces.length / PAGE_SIZE);
    const paginated = dreamPlaces.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 mb-2">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Wishlist</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Dream <span className="text-emerald-600">Places</span>
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {dreamPlaces.length} locations on your wishlist.
                    </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                    <Heart className="w-5 h-5 fill-emerald-500" />
                </div>
            </div>

            {dreamPlaces.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {paginated.map((place) => (
                            <Link
                                key={place._id}
                                to={`/places/${place._id}`}
                                className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <img
                                        src={place.photos?.[0] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80'}
                                        alt={place.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                    <button
                                        onClick={(e) => handleRemoveDream(e, place._id)}
                                        className="absolute top-2 right-2 p-1.5 bg-white/20 hover:bg-rose-500 backdrop-blur-md rounded-full text-white transition-all shadow-sm z-10"
                                        title="Remove from Dream Places"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>

                                    <div className="absolute bottom-3 left-3 right-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-sm font-bold text-white leading-tight mb-0.5 line-clamp-1">{place.name}</h3>
                                        <div className="flex items-center gap-1 text-emerald-300 font-bold text-[9px] uppercase tracking-wider line-clamp-1">
                                            <MapPin className="w-3 h-3 flex-shrink-0" />
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
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl py-16 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mb-5 border border-slate-50">
                        <MapIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-1">Wishlist empty</h3>
                    <p className="text-xs text-slate-500 max-w-xs mb-6 font-medium">Find locations you love in the Explore tab.</p>
                    <Link
                        to="/explore"
                        className="px-6 py-2.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm hover:scale-105 transition-all"
                    >
                        Explore Places
                    </Link>
                </div>
            )}
        </div>
    );
};

export default DreamPlaces;
