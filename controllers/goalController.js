// controllers/goalController.js
const asyncHandler = require('express-async-handler');
const Goal = require('../models/Goal');

// @desc    Get all goals
// @route   GET /api/goals
// @access  Public
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({});

    // If no goals exist, create default goals
    if (goals.length === 0) {
        const defaultGoals = [
            {
                name: "Buy a House in Mumbai",
                amount: 2000000,
                icon: "Home",
                selected: true,
                timeline: "10 years",
                current: 120000,
            },
            {
                name: "Emergency Fund",
                amount: 100000,
                icon: "Briefcase",
                selected: true,
                timeline: "1 year",
                current: 45000,
            },
            {
                name: "Financial support for family",
                amount: 50000,
                icon: "Users",
                selected: true,
                timeline: "5 years",
                current: 15000,
            },
        ];

        await Goal.insertMany(defaultGoals);
        const newGoals = await Goal.find({});
        return res.json(newGoals);
    }

    res.json(goals);
});

// @desc    Add a new goal
// @route   POST /api/goals
// @access  Public
const addGoal = asyncHandler(async (req, res) => {
    const { name, amount, icon, selected, timeline, current } = req.body;

    if (!name || !amount || !timeline) {
        res.status(400);
        throw new Error('Please provide name, amount, and timeline');
    }

    const goal = await Goal.create({
        name,
        amount,
        icon: icon || 'Target',
        selected: selected !== undefined ? selected : true,
        timeline,
        current: current || 0,
    });

    res.status(201).json(goal);
});

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Public
const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.json(updatedGoal);
});

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Public
const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }

    await goal.deleteOne();

    res.json({ message: 'Goal removed' });
});

module.exports = {
    getGoals,
    addGoal,
    updateGoal,
    deleteGoal,
};