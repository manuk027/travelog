const User = require('../models/User');
const Place = require('../models/Place');
const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getDashboardStats = catchAsync(async (req, res, next) => {
    const totalUsers = await User.countDocuments();
    const totalPlaces = await Place.countDocuments();
    const pendingApprovals = await Place.countDocuments({ status: 'pending' });

    // 30 days ago date
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));

    // Uploads activity over time
    const uploadsOverTime = await Place.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: '%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // User registrations over time
    const usersOverTime = await User.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: '%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Places by status
    const placesByStatus = await Place.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    // Top Users (most places uploaded)
    const topUsers = await Place.aggregate([
        { $group: { _id: '$createdBy', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $project: {
                _id: 1,
                count: 1,
                name: '$user.name',
                username: '$user.username',
                email: '$user.email'
            }
        }
    ]);

    const recentActivities = await Place.find()
        .sort('-createdAt')
        .limit(5)
        .populate('createdBy', 'name username email');

    res.status(200).json({
        success: true,
        data: {
            stats: {
                totalUsers,
                totalPlaces,
                pendingApprovals,
                uploadsOverTime,
                usersOverTime,
                placesByStatus,
                topUsers,
                recentActivities
            }
        }
    });
});

exports.getUsers = catchAsync(async (req, res, next) => {
    const users = await User.find().select('-password').sort('-createdAt');

    res.status(200).json({
        success: true,
        results: users.length,
        data: {
            users
        }
    });
});

exports.getUserDetails = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    const places = await Place.find({ createdBy: user._id });

    res.status(200).json({
        success: true,
        data: {
            user,
            places
        }
    });
});

exports.updateUserStatus = catchAsync(async (req, res, next) => {
    const { isBlocked } = req.body;

    if (isBlocked === undefined) {
        return next(new AppError('Please specify isBlocked status', 400));
    }

    // Prevent blocking self or other admins
    const userToUpdate = await User.findById(req.params.id);
    if (!userToUpdate) {
        return next(new AppError('User not found', 404));
    }
    if (userToUpdate.role === 'admin') {
        return next(new AppError('Cannot block another admin', 403));
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isBlocked },
        { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
        success: true,
        message: `User status updated successfully`,
        data: {
            user
        }
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    // Soft delete by blocking, or hard delete. Currently implementing hard delete for simplicity but usually soft delete is preferred.
    // We'll hard delete the user but we need to also handle their places? Let's just block them instead for "soft delete". 
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }
    if (user.role === 'admin') {
        return next(new AppError('Cannot delete another admin', 403));
    }

    await Place.deleteMany({ createdBy: user._id }); // cleanup places
    await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
        success: true,
        data: null
    });
});

exports.getNotifications = catchAsync(async (req, res, next) => {
    const notifications = await Notification.find().sort('-createdAt').limit(50);

    res.status(200).json({
        success: true,
        results: notifications.length,
        data: {
            notifications
        }
    });
});

exports.markNotificationRead = catchAsync(async (req, res, next) => {
    const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        return next(new AppError('No notification found with that ID', 404));
    }

    res.status(200).json({
        success: true,
        data: {
            notification
        }
    });
});
