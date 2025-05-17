// models/Allocation.js
const mongoose = require('mongoose');

const allocationSchema = mongoose.Schema(
    {
        savings: {
            type: Number,
            required: true,
            default: 30,
        },
        needs: {
            type: Number,
            required: true,
            default: 50,
        },
        wants: {
            type: Number,
            required: true,
            default: 20,
        },
    },
    {
        timestamps: true,
    }
);

const Allocation = mongoose.model('Allocation', allocationSchema);

module.exports = Allocation;