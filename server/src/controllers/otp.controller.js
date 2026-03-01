const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendWhatsAppOTP } = require('../services/whatsapp.service');

// Generate a 6-digit numeric OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * POST /auth/send-otp
 * Protected — user must be logged in with a local account.
 * Sends a 6-digit OTP to the user's WhatsApp.
 */
exports.sendOTP = catchAsync(async (req, res, next) => {
    // Only local-auth users can change password
    const user = await User.findById(req.user.id);

    if (!user) return next(new AppError('User not found', 404));
    if (user.authProvider !== 'local') {
        return next(new AppError('Password change is not available for Google-authenticated accounts', 400));
    }

    // Use phone from request body or the saved phone number
    const phone = (req.body.phone || user.phoneNumber || '').trim();
    if (!phone) {
        return next(new AppError('Please provide a phone number', 400));
    }

    // Normalise to E.164 if not already (assume India +91 if no country code)
    const normalised = phone.startsWith('+') ? phone : `+${phone.replace(/\D/g, '')}`;
    if (normalised.replace(/\D/g, '').length < 7) {
        return next(new AppError('Invalid phone number', 400));
    }

    // Generate OTP and hash it
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save hash + expiry (and optionally update stored phone)
    user.otpHash = otpHash;
    user.otpExpires = otpExpires;
    if (req.body.phone) user.phoneNumber = normalised;
    await user.save({ validateBeforeSave: false });

    // Send via WhatsApp
    try {
        await sendWhatsAppOTP(normalised, otp);
    } catch (err) {
        // Roll back OTP fields so user can retry
        user.otpHash = undefined;
        user.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });
        console.error('WhatsApp send error:', err.message);
        return next(new AppError('Failed to send WhatsApp OTP. Please check your phone number and try again.', 500));
    }

    res.status(200).json({
        success: true,
        message: `OTP sent to WhatsApp number ending in ${normalised.slice(-4)}`
    });
});

/**
 * POST /auth/verify-otp-change-password
 * Protected — user must be logged in.
 * Verifies OTP and changes password.
 */
exports.verifyOTPAndChangePassword = catchAsync(async (req, res, next) => {
    const { otp, newPassword, confirmPassword } = req.body;

    if (!otp || !newPassword || !confirmPassword) {
        return next(new AppError('Please provide OTP, new password, and confirmation', 400));
    }
    if (newPassword !== confirmPassword) {
        return next(new AppError('Passwords do not match', 400));
    }
    if (newPassword.length < 8) {
        return next(new AppError('Password must be at least 8 characters', 400));
    }

    // Fetch with hidden OTP fields
    const user = await User.findById(req.user.id).select('+otpHash +otpExpires +password');

    if (!user) return next(new AppError('User not found', 404));
    if (!user.otpHash || !user.otpExpires) {
        return next(new AppError('No OTP was requested. Please request a new one.', 400));
    }
    if (user.otpExpires < new Date()) {
        return next(new AppError('OTP has expired. Please request a new one.', 400));
    }

    const isValid = await bcrypt.compare(otp, user.otpHash);
    if (!isValid) {
        return next(new AppError('Invalid OTP. Please try again.', 400));
    }

    // OTP is valid — update password and clear OTP fields
    user.password = newPassword; // pre-save hook hashes it
    user.otpHash = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password changed successfully. Please log in with your new password.'
    });
});
