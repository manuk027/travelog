const express = require('express');
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router({ mergeParams: true });

// GET /api/v1/places/:placeId/reviews
router.get('/', reviewController.getReviewsForPlace);

// Authenticated routes
router.use(authMiddleware.protect);

router.post('/', reviewController.createReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
