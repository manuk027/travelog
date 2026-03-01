import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Check, X, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';

const PAGE_SIZE = 6;

const AdminApprovals = () => {
    const { api } = useAuth();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPendingPlaces = async () => {
        try {
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
            toast.error('Failed to update place status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    const totalPages = Math.ceil(places.length / PAGE_SIZE);
    const paginated = places.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div className="animate-fade-in space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Pending Approvals</h1>
                    <p className="mt-0.5 text-sm text-slate-400 font-medium">Review places submitted by users before they go public.</p>
                </div>
                {places.length > 0 && (
                    <span className="text-xs text-slate-400 font-medium">{places.length} pending</span>
                )}
            </div>

            {places.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center text-center border border-slate-100 shadow-sm">
                    <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 text-emerald-500">
                        <Check className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">All caught up!</h3>
                    <p className="text-slate-400 mt-1 text-sm font-medium max-w-xs">No pending submissions awaiting approval.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginated.map((place) => (
                            <div key={place._id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-200">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={place.photos?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'}
                                        alt={place.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-2 right-2 bg-white/95 text-amber-600 text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-widest shadow-sm">
                                        Pending
                                    </div>
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="text-sm font-black text-slate-800 mb-1 leading-tight line-clamp-1">{place.name}</h3>
                                        <div className="flex items-start gap-1 text-slate-400 text-xs mb-3">
                                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-emerald-500" />
                                            <span className="line-clamp-1">{place.district}, {place.country}</span>
                                        </div>

                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 mb-3">
                                            <div className="w-4 h-4 rounded-md bg-emerald-100 flex items-center justify-center text-[8px] font-black text-emerald-700 uppercase">
                                                {(place.createdBy?.name || place.createdBy?.username)?.charAt(0) || '?'}
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none">
                                                By {place.createdBy?.name || place.createdBy?.username || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-auto">
                                        <button
                                            onClick={() => handleAction(place._id, 'approved')}
                                            className="flex justify-center items-center gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 py-2 rounded-lg font-bold text-xs transition-all"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleAction(place._id, 'rejected')}
                                            className="flex justify-center items-center gap-1.5 bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 py-2 rounded-lg font-bold text-xs transition-all border border-slate-200 hover:border-rose-100"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                            Reject
                                        </button>
                                    </div>

                                    <Link
                                        to={`/places/${place._id}`}
                                        className="mt-3 text-center text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors"
                                    >
                                        View full details →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            )}
        </div>
    );
};

export default AdminApprovals;
