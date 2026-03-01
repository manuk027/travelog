require('dotenv').config();
const app = require('../src/app');
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');

// Connect to MongoDB if not already connected (crucial for serverless cold starts)
if (mongoose.connection.readyState === 0) {
    connectDB().catch(console.error);
}

// Export the Express app so Vercel can handle HTTP requests
module.exports = app;
