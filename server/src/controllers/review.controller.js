const Review = require('../models/Review');
const Place = require('../models/Place');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createReview = catchAsync(async (req, res, next) => {
    const { placeId } = req.params;
    const { rating, comment } = req.body;

    const place = await Place.findById(placeId);
    if (!place) return next(new AppError('Place not found', 404));

    const review = await Review.create({
        user: req.user.id,
        place: placeId,
        rating,
        comment
    });

    res.status(201).json({
        status: 'success',
        data: { review }
    });
});

exports.getReviewsForPlace = catchAsync(async (req, res, next) => {
    const { placeId } = req.params;
    const reviews = await Review.find({ place: placeId }).sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: { reviews }
    });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError('Review not found', 404));

    // Only user who created the review or admin can delete it
    if (review.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('You do not have permission to delete this review', 403));
    }

    await review.deleteOne();

    res.status(204).json({
        status: 'success',
        data: null
    });
});
