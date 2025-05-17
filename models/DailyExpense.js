// models/DailyExpense.js
const mongoose = require('mongoose');

const dailyExpenseSchema = mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
            default: '',
        },
        date: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const DailyExpense = mongoose.model('DailyExpense', dailyExpenseSchema);

module.exports = DailyExpense;