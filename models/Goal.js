// models/Goal.js
const mongoose = require('mongoose');

const goalSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        icon: {
            type: String,
            required: true,
            default: 'Target',
        },
        selected: {
            type: Boolean,
            default: true,
        },
        timeline: {
            type: String,
            required: true,
        },
        current: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;