const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user']
        },
        place: {
            type: mongoose.Schema.ObjectId,
            ref: 'Place',
            required: [true, 'Review must belong to a place']
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, 'Review must have a rating between 1 and 5']
        },
        comment: {
            type: String,
            required: [true, 'Review must have a comment'],
            trim: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Prevent user from submitting multiple reviews for the same place
reviewSchema.index({ place: 1, user: 1 }, { unique: true });

// Populate user details when finding reviews
reviewSchema.pre(/^find/, function () {
    this.populate({
        path: 'user',
        select: 'username name'
    });
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
