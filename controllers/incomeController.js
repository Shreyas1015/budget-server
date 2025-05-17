// controllers/incomeController.js
const asyncHandler = require('express-async-handler');
const Income = require('../models/Income');

// @desc    Get current income
// @route   GET /api/income
// @access  Public
const getIncome = asyncHandler(async (req, res) => {
    let income = await Income.findOne().sort({ createdAt: -1 });

    if (!income) {
        // Create default income if none exists
        income = await Income.create({ amount: 40000 });
    }

    res.json(income);
});

// @desc    Update income
// @route   POST /api/income
// @access  Public
const updateIncome = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
        res.status(400);
        throw new Error('Please provide a valid income amount');
    }

    const income = await Income.create({ amount });

    res.status(201).json(income);
});

module.exports = {
    getIncome,
    updateIncome,
};