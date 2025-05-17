// controllers/monthlyExpenseController.js
const asyncHandler = require('express-async-handler');
const MonthlyExpense = require('../models/MonthlyExpense');

// @desc    Get all monthly expenses
// @route   GET /api/monthly-expenses
// @access  Public
const getMonthlyExpenses = asyncHandler(async (req, res) => {
    const expenses = await MonthlyExpense.find({});

    // If no expenses exist, create default expenses
    if (expenses.length === 0) {
        const defaultExpenses = [
            { name: "Petrol", amount: 900, isRecurring: true },
            { name: "Mobile Recharge", amount: 267, isRecurring: true },
            { name: "Gym", amount: 1500, isRecurring: true },
            { name: "Diet/Trainer", amount: 1500, isRecurring: true },
        ];

        await MonthlyExpense.insertMany(defaultExpenses);
        const newExpenses = await MonthlyExpense.find({});
        return res.json(newExpenses);
    }

    res.json(expenses);
});

// @desc    Add a new monthly expense
// @route   POST /api/monthly-expenses
// @access  Public
const addMonthlyExpense = asyncHandler(async (req, res) => {
    const { name, amount, isRecurring } = req.body;

    if (!name || !amount) {
        res.status(400);
        throw new Error('Please provide name and amount');
    }

    const expense = await MonthlyExpense.create({
        name,
        amount,
        isRecurring: isRecurring !== undefined ? isRecurring : true,
    });

    res.status(201).json(expense);
});

// @desc    Delete a monthly expense
// @route   DELETE /api/monthly-expenses/:id
// @access  Public
const deleteMonthlyExpense = asyncHandler(async (req, res) => {
    const expense = await MonthlyExpense.findById(req.params.id);

    if (!expense) {
        res.status(404);
        throw new Error('Expense not found');
    }

    await expense.deleteOne();

    res.json({ message: 'Expense removed' });
});

module.exports = {
    getMonthlyExpenses,
    addMonthlyExpense,
    deleteMonthlyExpense,
};