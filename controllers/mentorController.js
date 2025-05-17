// controllers/mentorController.js
const asyncHandler = require('express-async-handler');
const Conversation = require('../models/Conversation');
const { generateAdvice } = require('../utils/generateAdvice');

// @desc    Get conversation history
// @route   GET /api/mentor/conversation
// @access  Public
const getConversationHistory = asyncHandler(async (req, res) => {
    let conversation = await Conversation.findOne();

    if (!conversation) {
        // Create a new conversation with welcome message
        conversation = await Conversation.create({
            messages: [
                {
                    role: 'assistant',
                    content: "Hello! I'm your AI financial mentor. I can analyze your financial data and provide personalized advice. What would you like to know about your finances today?",
                    timestamp: new Date(),
                },
            ],
        });
    }

    res.json(conversation.messages);
});

// @desc    Save conversation history
// @route   POST /api/mentor/conversation
// @access  Public
const saveConversation = asyncHandler(async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        res.status(400);
        throw new Error('Please provide valid messages array');
    }

    let conversation = await Conversation.findOne();

    if (!conversation) {
        conversation = await Conversation.create({ messages });
    } else {
        conversation.messages = messages;
        await conversation.save();
    }

    res.status(201).json(conversation);
});

// @desc    Get financial advice based on query
// @route   POST /api/mentor/advice
// @access  Public
const getFinancialAdvice = asyncHandler(async (req, res) => {
    const { query } = req.body;

    if (!query) {
        res.status(400);
        throw new Error('Please provide a query');
    }

    // Generate advice based on the query and financial data
    const advice = await generateAdvice(query);

    res.json({ advice });
});

module.exports = {
    getConversationHistory,
    saveConversation,
    getFinancialAdvice,
};