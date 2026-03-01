const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
        },
        password: {
            type: String,
            required: function () {
                return this.authProvider === 'local';
            },
            minlength: 8,
            select: false // never return password by default
        },
        name: {
            type: String,
            required: [true, 'Please provide a full name'],
            trim: true
        },
        phoneNumber: {
            type: String,
            trim: true
        },
        residentialLocation: {
            address: String,
            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        },
        visitedPlaces: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Place'
            }
        ],
        dreamPlaces: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Place'
            }
        ],
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local'
        },
        // OTP for password change via WhatsApp
        otpHash: {
            type: String,
            select: false
        },
        otpExpires: {
            type: Date,
            select: false
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

userSchema.virtual('displayName').get(function () {
    return this.name || this.username;
});

userSchema.virtual('avatar').get(function () {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.displayName)}&background=10b981&color=fff&bold=true`;
});

// Hash password before saving if it was modified
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 12);
});

// Compare given password with document password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Seed Admin logic
userSchema.statics.seedAdmin = async function () {
    const adminExists = await this.findOne({ role: 'admin' });
    if (!adminExists) {
        await this.create({
            email: 'admin@test.com',
            password: 'Admin@123',
            name: 'TraveLog',
            role: 'admin',
            authProvider: 'local'
        });
        console.log('✅ Default Admin user seeded');
    } else {
        console.log('⚡ Admin user already exists');
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
