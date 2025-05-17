// controllers/dailyExpenseController.js
const asyncHandler = require('express-async-handler');
const DailyExpense = require('../models/DailyExpense');

// @desc    Get all daily expenses
// @route   GET /api/daily-expenses
// @access  Public
const getDailyExpenses = asyncHandler(async (req, res) => {
    const expenses = await DailyExpense.find({}).sort({ date: -1 });
    res.json(expenses);
});

// @desc    Get daily expenses for a specific date
// @route   GET /api/daily-expenses/date/:date
// @access  Public
const getDailyExpensesByDate = asyncHandler(async (req, res) => {
    const { date } = req.params;
    const expenses = await DailyExpense.find({ date });
    res.json(expenses);
});

// @desc    Get daily expenses for a specific month
// @route   GET /api/daily-expenses/month/:year/:month
// @access  Public
const getDailyExpensesByMonth = asyncHandler(async (req, res) => {
    const { year, month } = req.params;

    // Create date range for the month
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.padStart(2, '0')}-${lastDay}`;

    const expenses = await DailyExpense.find({
        date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    res.json(expenses);
});

// @desc    Add a new daily expense
// @route   POST /api/daily-expenses
// @access  Public
const addDailyExpense = asyncHandler(async (req, res) => {
    const { amount, category, notes, date } = req.body;

    if (!amount || !category || !date) {
        res.status(400);
        throw new Error('Please provide amount, category, and date');
    }

    const expense = await DailyExpense.create({
        amount,
        category,
        notes: notes || '',
        date,
    });

    res.status(201).json(expense);
});

// @desc    Delete a daily expense
// @route   DELETE /api/daily-expenses/:id
// @access  Public
const deleteDailyExpense = asyncHandler(async (req, res) => {
    const expense = await DailyExpense.findById(req.params.id);

    if (!expense) {
        res.status(404);
        throw new Error('Expense not found');
    }

    await expense.deleteOne();

    res.json({ message: 'Expense removed' });
});

module.exports = {
    getDailyExpenses,
    getDailyExpensesByDate,
    getDailyExpensesByMonth,
    addDailyExpense,
    deleteDailyExpense,
};