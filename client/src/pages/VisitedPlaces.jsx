import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { MapPin, Loader2, Map as MapIcon, Globe, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const VisitedPlaces = () => {
    const { api } = useAuth();
    const [loading, setLoading] = useState(true);
    const [visitedPlaces, setVisitedPlaces] = useState([]);

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
                <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">My Journey</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        Visited <span className="text-emerald-600">Places</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 max-w-lg">
                        You have explored {visitedPlaces.length} unique locations. Keep discovering the world's hidden gems!
                    </p>
                </div>
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2rem] flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-200/50">
                    <Globe className="w-10 h-10" />
                </div>
            </div>

            {visitedPlaces.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visitedPlaces.map((place) => (
                        <Link
                            key={place._id}
                            to={`/places/${place._id}`}
                            className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out"
                        >
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <img
                                    src={place.photos?.[0] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80'}
                                    alt={place.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-xl font-bold text-white leading-tight mb-2">{place.name}</h3>
                                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs uppercase tracking-widest">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {place.district}, {place.state}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] py-24 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl flex items-center justify-center text-slate-300 mb-8 border border-slate-50">
                        <MapIcon className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">No visited places yet</h3>
                    <p className="text-slate-500 max-w-sm mb-10 font-medium">Your passport is waiting! Start your journey by exploring and marking locations as visited.</p>
                    <Link
                        to="/explore"
                        className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200/50 hover:scale-105 active:scale-95 transition-all"
                    >
                        Start Exploring
                    </Link>
                </div>
            )}
        </div>
    );
};

export default VisitedPlaces;
