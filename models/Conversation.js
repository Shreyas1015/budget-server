// models/Conversation.js
const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema(
    {
        messages: [
            {
                role: {
                    type: String,
                    required: true,
                    enum: ['user', 'assistant'],
                },
                content: {
                    type: String,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;