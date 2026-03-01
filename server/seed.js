require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/travelLocation';

const cleanAndSeedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Note: For a real app, only seed if not exists.
        // We will just verify admin.
        await User.seedAdmin();

        console.log('✅ Default Admin (admin | admin123#*@) ensured.');
        process.exit();
    } catch (err) {
        console.error('❌ Mongoose connection error:', err);
        process.exit(1);
    }
}

cleanAndSeedDB();
