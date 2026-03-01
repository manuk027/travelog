import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MapViewer from '../components/MapViewer';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { Loader2, MapPin, Navigation, Calendar, User as UserIcon, CheckCircle2, Star, Trash2, Copy, Check, Heart, Pencil } from 'lucide-react';
import { toast } from 'react-toastify';

const PlaceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api, user } = useAuth();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [isVisited, setIsVisited] = useState(false);
    const [visitedLoading, setVisitedLoading] = useState(false);
    const [isDream, setIsDream] = useState(false);
    const [dreamLoading, setDreamLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchPlaceDetails = async () => {
            try {
                // Use allSettled to prevent one failure (e.g. reviews) from crashing the whole page
                const [placeRes, reviewsRes] = await Promise.allSettled([
                    api.get(`/places/${id}`),
                    api.get(`/places/${id}/reviews`)
                ]);

                if (placeRes.status === 'fulfilled') {
                    setPlace(placeRes.value.data.data.place);
                } else {
                    toast.error('Failed to fetch place details');
                }

                if (reviewsRes.status === 'fulfilled') {
                    setReviews(reviewsRes.value.data.data.reviews);
                } else {
                    console.error('Failed to fetch reviews:', reviewsRes.reason);
                }

                if (user && placeRes.status === 'fulfilled') {
                    const userRes = await api.get('/users/me');
                    const profileData = userRes.data.data.user;

                    const visited = profileData.visitedPlaces?.some(p => p._id === id || p === id);
                    setIsVisited(visited);

                    const dream = profileData.dreamPlaces?.some(p => p._id === id || p === id);
                    setIsDream(dream);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };
        fetchPlaceDetails();
    }, [id, api, user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
            </div>
        );
    }

    if (!place) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Place not found</h2>
                <Link to="/explore" className="mt-4 text-primary-500 hover:text-primary-600">
                    Back to explore
                </Link>
            </div>
        );
    }

    // Combine photos and videos for carousel
    const mediaList = [...(place.photos || []), ...(place.videos || [])];

    const renderMedia = (url, isVideo) => {
        if (isVideo) {
            return (
                <video
                    key={url}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    controls
                    src={url}
                />
            );
        }
        return (
            <img
                key={url}
                src={url}
                alt={`Media for ${place.name}`}
                className="w-full h-full object-cover transition-opacity duration-300"
            />
        );
    };

    const isVideoUrl = (url) => url.match(/\.(mp4|mov|webm)$/i) || url.includes('/video/upload/');

    const handleToggleVisited = async () => {
        if (!user) return toast.info('Please log in to track your visited places');

        setVisitedLoading(true);
        try {
            const res = await api.post(`/users/toggle-visited/${id}`);
            setIsVisited(!isVisited);
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update visited status');
        } finally {
            setVisitedLoading(false);
        }
    };

    const handleToggleDream = async () => {
        if (!user) return toast.info('Please log in to save to your dream places');

        setDreamLoading(true);
        try {
            const res = await api.post(`/users/toggle-dream/${id}`);
            setIsDream(!isDream);
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update dream status');
        } finally {
            setDreamLoading(false);
        }
    };

    const handleReviewSubmitted = (newReview) => {
        setReviews([newReview, ...reviews]);
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            await api.delete(`/reviews/${reviewId}`);
            setReviews(reviews.filter(r => r._id !== reviewId));
            toast.success('Review deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete review');
        }
    };

    const handleDeletePlace = async () => {
        if (!window.confirm('Are you SURE you want to delete this location? This cannot be undone.')) return;

        try {
            await api.delete(`/places/${id}`);
            toast.success('Location deleted successfully');
            navigate('/explore');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete location');
        }
    };

    const handleCopyPlusCode = () => {
        if (place.plusCode) {
            navigator.clipboard.writeText(place.plusCode);
            setCopied(true);
            toast.success('Plus Code copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">

            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {place.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {[place.district, place.state, place.country].filter(Boolean).join(', ')}
                            {place.pincode && ` (${place.pincode})`}
                        </span>
                        <span className="flex items-center gap-1">
                            <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                                <img src={place.createdBy?.avatar} alt={place.createdBy?.displayName} className="w-full h-full object-cover" />
                            </div>
                            Shared by <span className="font-semibold text-primary-600 dark:text-primary-400">
                                {place.createdBy?.displayName || 'Explorer'}
                            </span>
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(place.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {place.status === 'pending' && user?.role === 'admin' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                        Pending Approval
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Area (Media) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Media display */}
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-soft dark:shadow-soft-dark border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                        {mediaList.length > 0 ? (
                            renderMedia(mediaList[activeMediaIndex], isVideoUrl(mediaList[activeMediaIndex]))
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                No media available
                            </div>
                        )}
                    </div>

                    {/* Media Thumbnails */}
                    {mediaList.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                            {mediaList.map((url, index) => {
                                const isVideo = isVideoUrl(url);
                                return (
                                    <button
                                        key={index}
                                        onClick={() => setActiveMediaIndex(index)}
                                        className={`relative w-24 h-24 flex-shrink-0 snap-start rounded-lg overflow-hidden border-2 transition-all ${activeMediaIndex === index
                                            ? 'border-primary-500 scale-105 shadow-md'
                                            : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        {isVideo ? (
                                            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-primary-400">
                                                ▶ Video
                                            </div>
                                        ) : (
                                            <img src={url} alt="Thumbnail" className="w-full h-full object-cover" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Description Section */}
                    <div className="mt-12 space-y-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">About this Location</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                            {place.description || 'No description provided for this magical spot yet.'}
                        </p>
                    </div>

                    {/* Reviews Section */}
                    <div className="space-y-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                        {user && (
                            <ReviewForm
                                placeId={id}
                                api={api}
                                onReviewSubmitted={handleReviewSubmitted}
                                isVisited={isVisited}
                            />
                        )}

                        <ReviewList
                            reviews={reviews}
                            currentUser={user}
                            onDeleteReview={handleDeleteReview}
                        />
                    </div>
                </div>

                {/* Sidebar (Map & Actions) */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft dark:shadow-soft-dark border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Navigation className="w-5 h-5 text-primary-500" />
                                Location Area
                            </h3>
                            {place.plusCode && (
                                <button
                                    onClick={handleCopyPlusCode}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 transition-colors shadow-sm"
                                    title="Copy Google Plus Code"
                                >
                                    <span className="text-xs font-bold font-mono tracking-wide">{place.plusCode}</span>
                                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                            )}
                        </div>

                        <div className="h-[300px] mb-4">
                            {place.location?.coordinates ? (
                                <MapViewer
                                    lat={place.location.coordinates[1]}
                                    lng={place.location.coordinates[0]}
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                                    Location data unavailable
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 mt-4 text-sm text-slate-600 dark:text-slate-400">
                            {place.location?.coordinates && (
                                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                    <span>Coordinates</span>
                                    <span className="font-medium font-mono text-slate-800 dark:text-slate-300">
                                        {place.location.coordinates[1].toFixed(5)}, {place.location.coordinates[0].toFixed(5)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <a
                            href={place.location?.coordinates ? `https://www.google.com/maps/dir/?api=1&destination=${place.location.coordinates[1]},${place.location.coordinates[0]}` : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`mt-6 w-full flex items-center justify-center py-3 px-6 rounded-xl font-bold transition-all ${place.location?.coordinates
                                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                            onClick={(e) => !place.location?.coordinates && e.preventDefault()}
                        >
                            Get Directions
                        </a>

                        <button
                            onClick={handleToggleDream}
                            disabled={dreamLoading}
                            className={`mt-4 w-full py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2 ${isDream
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-500 hover:text-emerald-600'
                                } disabled:opacity-50`}
                        >
                            {dreamLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Heart className={`w-5 h-5 ${isDream ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                                    <span>{isDream ? 'Saved to Dreams' : 'Save to Dreams'}</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleToggleVisited}
                            disabled={visitedLoading}
                            className={`mt-4 w-full py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2 ${isVisited
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-500 hover:text-emerald-600'
                                } disabled:opacity-50`}
                        >
                            {visitedLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <CheckCircle2 className={`w-5 h-5 ${isVisited ? 'fill-emerald-600 text-white' : ''}`} />
                                    <span>{isVisited ? 'Visited' : 'Mark as Visited'}</span>
                                </>
                            )}
                        </button>

                        {user?.role === 'admin' && (
                            <>
                                <Link
                                    to={`/places/${id}/edit`}
                                    className="mt-4 w-full py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2 bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                                >
                                    <Pencil className="w-4 h-4" />
                                    <span>Edit Place Details</span>
                                </Link>
                                <button
                                    onClick={handleDeletePlace}
                                    className="mt-4 w-full py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2 bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    <span>Delete Location</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceDetails;
