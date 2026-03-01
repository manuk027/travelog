import { Link } from 'react-router-dom';
import { MapPin, User as UserIcon, Eye } from 'lucide-react';

const PlaceCard = ({ place }) => {
    const coverImage = place.photos && place.photos.length > 0
        ? place.photos[0]
        : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop';

    return (
        <Link to={`/places/${place._id}`} className="block group">
            <div className="card-hover h-full flex flex-col">
                {/* Image container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={coverImage}
                        alt={place.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Hover action */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-5 py-2.5 flex items-center gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <Eye className="w-4 h-4 text-primary-600" />
                            <span className="text-sm font-semibold text-primary-700">View Details</span>
                        </div>
                    </div>

                    {/* Status badge */}
                    {place.status && place.status !== 'approved' && (
                        <div className="absolute top-3 left-3">
                            <span className={`badge ${place.status === 'pending' ? 'badge-pending' : 'badge-rejected'}`}>
                                {place.status}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {place.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-3">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="text-sm line-clamp-1">
                            {[place.state, place.country].filter(Boolean).join(', ') || 'Unknown Location'}
                        </span>
                    </div>

                    {place.description && (
                        <p className="text-sm text-slate-400 dark:text-slate-500 line-clamp-2 mb-4 flex-1">
                            {place.description}
                        </p>
                    )}

                    {/* Footer */}
                    {place.createdBy && (
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/50 mt-auto">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                                {(place.createdBy.name || place.createdBy.username)?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 truncate capitalize">
                                {place.createdBy.name || place.createdBy.username || 'Unknown'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default PlaceCard;
