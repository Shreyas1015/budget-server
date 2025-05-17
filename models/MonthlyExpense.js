// models/MonthlyExpense.js
const mongoose = require('mongoose');

const monthlyExpenseSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        isRecurring: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const MonthlyExpense = mongoose.model('MonthlyExpense', monthlyExpenseSchema);

module.exports = MonthlyExpense;