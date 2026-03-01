const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middlewares/error.middleware');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: process.env.NODE_ENV === 'development' ? 1000 : 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Implement CORS
app.use(cors());

// 2) ROUTES
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the Travel App API',
        data: {}
    });
});

const authRouter = require('./routes/auth.routes');
const placeRouter = require('./routes/place.routes');
const adminRouter = require('./routes/admin.routes');
const userRouter = require('./routes/user.routes');
const reviewRouter = require('./routes/review.routes');

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/places', placeRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter); // Global access to reviews if needed

app.all(/(.*)/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 3) ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
