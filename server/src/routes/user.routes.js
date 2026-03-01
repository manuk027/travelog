const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/me', userController.getMe);
router.patch('/update-me', userController.updateMe);
router.post('/toggle-visited/:placeId', userController.toggleVisited);
router.post('/toggle-dream/:placeId', userController.toggleDreamPlace);

module.exports = router;
