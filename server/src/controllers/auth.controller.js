const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        success: true,
        message: 'Authentication successful',
        token,
        data: {
            user
        }
    });
};

exports.register = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        authProvider: 'local'
    });

    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if user exists & password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) Check if user is blocked
    if (user.isBlocked) {
        return next(new AppError('Account is blocked. Contact support.', 403));
    }

    // 4) If everything ok, send token to client
    createSendToken(user, 200, res);
});

exports.googleLogin = catchAsync(async (req, res, next) => {
    const { email, name, googleId } = req.body;

    if (!email || !googleId) {
        return next(new AppError('Google credentials missing', 400));
    }

    let user = await User.findOne({ email });

    if (!user) {
        // Create new google user
        user = await User.create({
            username: name || email.split('@')[0],
            email: email,
            authProvider: 'google',
            // Password is not required for google auth based on our schema logic
        });
    } else if (user.isBlocked) {
        return next(new AppError('Account is blocked. Contact support.', 403));
    }

    createSendToken(user, 200, res);
});

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: {
            user
        }
    });
});
