// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Check if we already have a connection
        if (mongoose.connection.readyState === 1) {
            console.log('Using existing database connection');
            return;
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            family: 4, // Use IPv4, skip trying IPv6
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 5, // Maintain at least 5 socket connections
            connectTimeoutMS: 10000, // Give up initial connection after 10s
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Don't exit process in serverless environment
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB;

