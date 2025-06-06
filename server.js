// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Logger for development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Connect to database before handling requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

// Routes
app.use('/api/income', require('./routes/incomeRoutes'));
app.use('/api/allocation', require('./routes/allocationRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/monthly-expenses', require('./routes/monthlyExpenseRoutes'));
app.use('/api/daily-expenses', require('./routes/dailyExpenseRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/mentor', require('./routes/mentorRoutes'));

// Root route
app.get('/', (req, res) => {
    res.send('Budget Tracker API is running...');
});

// Error handler middleware
app.use(errorHandler);

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

// Export the Express app for Vercel
module.exports = app;