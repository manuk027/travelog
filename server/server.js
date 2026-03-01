require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const socket = require('./src/config/socket');
const User = require('./src/models/User');

// Handle Uncaught Exceptions
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

// Connect to database
connectDB();

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io
socket.init(server);

// Seed default admin user once DB is connected
mongoose = require('mongoose');
mongoose.connection.once('open', () => {
    User.seedAdmin().catch(err => {
        console.error('Error seeding admin user:', err);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle Unhandled Rejections
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
