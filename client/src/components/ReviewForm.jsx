import { useState } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ReviewForm = ({ placeId, onReviewSubmitted, api }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return toast.error('Please select a rating');
        if (!comment.trim()) return toast.error('Please enter a comment');

        setIsSubmitting(true);
        try {
            const res = await api.post(`/places/${placeId}/reviews`, {
                rating,
                comment: comment.trim()
            });
            toast.success('Review submitted successfully!');
            setRating(0);
            setComment('');
            if (onReviewSubmitted) onReviewSubmitted(res.data.data.review);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Leave a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="p-1 transition-transform hover:scale-110 active:scale-95"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        >
                            <Star
                                className={`w-8 h-8 ${(hover || rating) >= star
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-300 dark:text-slate-600'
                                    }`}
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm font-medium text-slate-500">
                        {rating > 0 ? `${rating} stars` : 'Select rating'}
                    </span>
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all min-h-[100px] text-sm"
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-900/10 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Posting...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Post Review</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
