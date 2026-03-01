const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

/**
 * Send an OTP via WhatsApp using Twilio.
 * @param {string} toPhone  - recipient phone in E.164 format, e.g. '+919876543210'
 * @param {string} otp      - 6-digit code
 */
exports.sendWhatsAppOTP = async (toPhone, otp) => {
    const to = toPhone.startsWith('whatsapp:') ? toPhone : `whatsapp:${toPhone}`;

    await client.messages.create({
        from: FROM,
        to,
        body: `🔐 Your TraveLog password-change OTP is: *${otp}*\n\nThis code expires in 10 minutes. Do not share it with anyone.`
    });
};
