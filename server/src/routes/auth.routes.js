const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const otpController = require('../controllers/otp.controller');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);

router.get('/me', authMiddleware.protect, authController.getMe);

// WhatsApp OTP password change (protected — must be logged in as local user)
router.post('/send-otp', authMiddleware.protect, otpController.sendOTP);
router.post('/verify-otp-change-password', authMiddleware.protect, otpController.verifyOTPAndChangePassword);

module.exports = router;
