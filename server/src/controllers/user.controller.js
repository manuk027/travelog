const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('visitedPlaces');
        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateMe = async (req, res, next) => {
    try {
        // Filter out unwanted fields that should not be updated
        const filteredBody = {};
        const allowedFields = ['name', 'email', 'phoneNumber', 'residentialLocation'];
        Object.keys(req.body).forEach(el => {
            if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
        });

        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: { user: updatedUser }
        });
    } catch (err) {
        next(err);
    }
};

exports.toggleVisited = async (req, res, next) => {
    try {
        const { placeId } = req.params;
        const user = await User.findById(req.user.id);

        const isVisited = user.visitedPlaces.includes(placeId);

        if (isVisited) {
            user.visitedPlaces.pull(placeId);
        } else {
            user.visitedPlaces.push(placeId);
        }

        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: 'success',
            message: isVisited ? 'Removed from visited' : 'Marked as visited',
            data: { visitedPlaces: user.visitedPlaces }
        });
    } catch (err) {
        next(err);
    }
};
