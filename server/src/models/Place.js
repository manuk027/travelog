const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Place must have a name'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Place must have a description'],
            trim: true
        },
        district: {
            type: String,
            required: [true, 'Place must have a district']
        },
        state: {
            type: String,
            required: [true, 'Place must have a state']
        },
        country: {
            type: String,
            required: [true, 'Place must have a country']
        },
        pincode: {
            type: String,
            required: [true, 'Place must have a pincode']
        },
        // GeoJSON
        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number] // [longitude, latitude]
        },
        photos: [String],
        videos: [String],
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Place must belong to a user']
        },
        plusCode: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes for performance and geospatial queries
placeSchema.index({ location: '2dsphere' });
placeSchema.index({ status: 1 });
placeSchema.index({ createdAt: -1 });

const Place = mongoose.model('Place', placeSchema);
module.exports = Place;
