const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: [true, 'Notification must have a message']
        },
        type: {
            type: String,
            enum: ['new_place', 'new_image', 'new_video', 'other'],
            default: 'new_place'
        },
        referenceId: {
            type: mongoose.Schema.ObjectId,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
