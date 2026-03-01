import { Star, User, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ReviewList = ({ reviews, currentUser, onDeleteReview }) => {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-lg font-medium">No reviews yet</p>
                <p className="text-sm">Be the first to share your experience!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Reviews
                <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {reviews.length}
                </span>
            </h3>

            <div className="grid gap-6">
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold overflow-hidden shadow-inner flex-shrink-0">
                                    {review.user?.avatar ? (
                                        <img src={review.user.avatar} alt={review.user.displayName || 'User'} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                                        {review.user?.displayName || 'Explorer'}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium truncate">
                                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${review.rating >= star
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-slate-200 dark:text-slate-700'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {(currentUser?.id === review.user?._id || currentUser?.role === 'admin') && (
                                    <button
                                        onClick={() => onDeleteReview(review._id)}
                                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete review"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                            {review.comment}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewList;
