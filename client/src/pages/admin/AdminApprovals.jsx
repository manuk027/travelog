import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Check, X, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminApprovals = () => {
    const { api } = useAuth();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingPlaces = async () => {
        try {
            // Admin sees pending places
            const res = await api.get('/places?status=pending');
            setPlaces(res.data.data.places);
        } catch (error) {
            toast.error('Failed to load pending approvals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingPlaces();
    }, [api]);

    const handleAction = async (id, status) => {
        try {
            await api.patch(`/places/${id}/status`, { status });
            toast.success(`Place ${status} successfully`);
            setPlaces(places.filter(p => p._id !== id));
        } catch (error) {
            toast.error(`Failed to update place status`);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Pending Approvals</h1>
                <p className="mt-2 text-slate-400 font-medium">Review places submitted by users before they go public.</p>
            </div>

            {places.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center border border-slate-100 shadow-sm">
                    <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mb-6 text-emerald-500">
                        <Check className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">All caught up!</h3>
                    <p className="text-slate-400 mt-2 font-medium max-w-xs">There are no pending submissions awaiting your approval at this time.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {places.map((place) => (
                        <div key={place._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-emerald-50/50 transition-all duration-300">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={place.photos?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'}
                                    alt={place.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-amber-600 text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest shadow-sm">
                                    Pending
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight tracking-tight line-clamp-1">{place.name}</h3>
                                    <div className="flex items-start gap-1.5 text-slate-400 font-medium text-sm mb-4">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                                        <span className="line-clamp-2">{place.district}, {place.country}</span>
                                    </div>

                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 mb-6">
                                        <div className="w-5 h-5 rounded-lg bg-emerald-100 flex items-center justify-center text-[10px] font-black text-emerald-700 uppercase">
                                            {place.createdBy?.username?.charAt(0) || '?'}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                                            By {place.createdBy?.username || 'Unknown'}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-auto">
                                    <button
                                        onClick={() => handleAction(place._id, 'approved')}
                                        className="flex justify-center items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-100 hover:shadow-xl hover:shadow-emerald-200"
                                    >
                                        <Check className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(place._id, 'rejected')}
                                        className="flex justify-center items-center gap-2 bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 py-3 rounded-2xl font-bold text-sm transition-all border border-slate-200 hover:border-rose-100"
                                    >
                                        <X className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>

                                <Link
                                    to={`/places/${place._id}`}
                                    className="mt-5 text-center text-xs font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors"
                                >
                                    View full details & media →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminApprovals;
