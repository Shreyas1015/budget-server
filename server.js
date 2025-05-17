// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors({
    origin: 'http://192.168.1.104:8081',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Logger for development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});