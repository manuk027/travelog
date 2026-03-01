const Place = require('../models/Place');
const User = require('../models/User');
const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const socketConfig = require('../config/socket');

// Public stats endpoint
exports.getStats = catchAsync(async (req, res, next) => {
    const [placesCount, countries, usersCount] = await Promise.all([
        Place.countDocuments({ status: 'approved' }),
        Place.distinct('country', { status: 'approved' }),
        User.countDocuments()
    ]);

    res.status(200).json({
        success: true,
        data: {
            places: placesCount,
            countries: countries.length,
            users: usersCount
        }
    });
});

exports.createPlace = catchAsync(async (req, res, next) => {
    const { name, description, plusCode, district, state, country, pincode, lat, lng } = req.body;

    if (!lat || !lng) {
        return next(new AppError('Please provide latitude and longitude', 400));
    }

    // Get uploaded files
    const photos = req.files?.photos ? req.files.photos.map(file => file.path) : [];
    const videos = req.files?.videos ? req.files.videos.map(file => file.path) : [];

    if (photos.length === 0) {
        return next(new AppError('Please upload at least one photo', 400));
    }

    const newPlace = await Place.create({
        name,
        description,
        plusCode,
        district,
        state,
        country,
        pincode,
        location: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        photos,
        videos,
        createdBy: req.user.id
    });

    // Create Admin Notification
    const notification = await Notification.create({
        message: `New place submitted: ${name} by ${req.user.username}`,
        type: 'new_place',
        referenceId: newPlace._id
    });

    // Emit real-time socket event
    try {
        const io = socketConfig.getIO();
        io.emit('admin-notification', notification);
    } catch (err) {
        console.error('Socket.io error:', err);
    }

    res.status(201).json({
        success: true,
        message: 'Place submitted successfully and is pending approval.',
        data: {
            place: newPlace
        }
    });
});

exports.getPlaces = catchAsync(async (req, res, next) => {
    let query = Place.find();

    // 1) Filter by status (default approved unless user is admin requesting pending)
    const status = req.query.status || 'approved';

    if (req.query.status && req.query.status === 'pending' && req.user && req.user.role === 'admin') {
        query = query.find({ status: 'pending' });
    } else {
        query = query.find({ status: 'approved' });
    }

    // 2) Geospatial filtering: /places?lat=34&lng=-118&distance=50
    if (req.query.lat && req.query.lng && req.query.distance) {
        const { lat, lng, distance } = req.query;
        // distance in radians = distance in km / earth radius in km
        const radius = distance / 6378.1;

        query = query.find({
            location: {
                $geoWithin: { $centerSphere: [[lng, lat], radius] }
            }
        });
    }

    // 3) Basic search & filters
    if (req.query.search) {
        query = query.find({ name: { $regex: req.query.search, $options: 'i' } });
    }
    if (req.query.country) {
        query = query.find({ country: { $regex: req.query.country, $options: 'i' } });
    }
    if (req.query.state) {
        query = query.find({ state: { $regex: req.query.state, $options: 'i' } });
    }
    if (req.query.district) {
        query = query.find({ district: { $regex: req.query.district, $options: 'i' } });
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit).populate('createdBy', 'name username email').sort('-createdAt');

    const places = await query;

    // Get total count for pagination
    const total = await Place.countDocuments(query.getFilter());

    res.status(200).json({
        success: true,
        results: places.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: {
            places
        }
    });
});

exports.getPlace = catchAsync(async (req, res, next) => {
    const place = await Place.findById(req.params.id).populate('createdBy', 'name username email displayName avatar');

    if (!place) {
        return next(new AppError('No place found with that ID', 404));
    }

    // If place is pending and the user is neither the creator nor an admin, deny access
    if (place.status !== 'approved') {
        if (!req.user || (req.user.id !== place.createdBy.id && req.user.role !== 'admin')) {
            return next(new AppError('This place is pending approval and cannot be viewed.', 403));
        }
    }

    res.status(200).json({
        success: true,
        data: {
            place
        }
    });
});

exports.updatePlaceStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
        return next(new AppError('Invalid status', 400));
    }

    const place = await Place.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
    );

    if (!place) {
        return next(new AppError('No place found with that ID', 404));
    }

    res.status(200).json({
        success: true,
        message: `Place status updated to ${status}`,
        data: {
            place
        }
    });
});

exports.deletePlace = catchAsync(async (req, res, next) => {
    const place = await Place.findByIdAndDelete(req.params.id);

    if (!place) {
        return next(new AppError('No place found with that ID', 404));
    }

    res.status(204).json({
        success: true,
        data: null
    });
});
