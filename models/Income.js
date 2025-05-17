// models/Income.js
const mongoose = require('mongoose');

const incomeSchema = mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
            default: 40000,
        },
    },
    {
        timestamps: true,
    }
);

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;