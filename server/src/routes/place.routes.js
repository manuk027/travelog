const express = require('express');
const placeController = require('../controllers/place.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');
const reviewRouter = require('./review.routes');

const router = express.Router();

router.use('/:placeId/reviews', reviewRouter);

// Public stats route (no auth needed)
router.get('/stats', placeController.getStats);

// Public routes (though conditionally depends on query)
// getPlaces optionally takes lat, lng, distance, status
router.get('/', (req, res, next) => {
    // Pass req user if token is present, else pass anonymously
    authMiddleware.protect(req, res, (err) => {
        // ignore error if not logged in (for public view of approved places)
        // we just want to parse user if present to allow admin to view pending
        if (err) req.user = null;
        next();
    });
}, placeController.getPlaces);

// Get single place
router.get('/:id', (req, res, next) => {
    // Similar logic to optionally parse user
    authMiddleware.protect(req, res, (err) => {
        if (err) req.user = null;
        next();
    });
}, placeController.getPlace);

// Protected routes (User / Admin)
router.use(authMiddleware.protect);

router.post('/', uploadMiddleware.uploadPlaceMedia, placeController.createPlace);

// Admin routes
router.use(authMiddleware.restrictTo('admin'));

router.patch('/:id/status', placeController.updatePlaceStatus);
router.delete('/:id', placeController.deletePlace);

module.exports = router;
