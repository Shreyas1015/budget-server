// controllers/allocationController.js
const asyncHandler = require('express-async-handler');
const Allocation = require('../models/Allocation');

// @desc    Get current allocation
// @route   GET /api/allocation
// @access  Public
const getAllocation = asyncHandler(async (req, res) => {
    let allocation = await Allocation.findOne().sort({ createdAt: -1 });

    if (!allocation) {
        // Create default allocation if none exists
        allocation = await Allocation.create({
            savings: 30,
            needs: 50,
            wants: 20,
        });
    }

    res.json(allocation);
});

// @desc    Update allocation
// @route   POST /api/allocation
// @access  Public
const updateAllocation = asyncHandler(async (req, res) => {
    const { savings, needs, wants } = req.body;

    // Validate input
    if (!savings || !needs || !wants) {
        res.status(400);
        throw new Error('Please provide savings, needs, and wants percentages');
    }

    if (savings + needs + wants !== 100) {
        res.status(400);
        throw new Error('Allocation percentages must sum to 100%');
    }

    const allocation = await Allocation.create({
        savings,
        needs,
        wants,
    });

    res.status(201).json(allocation);
});

module.exports = {
    getAllocation,
    updateAllocation,
};