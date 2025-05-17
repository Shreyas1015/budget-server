// routes/mentorRoutes.js
const express = require('express');
const router = express.Router();
const {
    getConversationHistory,
    saveConversation,
    getFinancialAdvice,
} = require('../controllers/mentorController');

router.route('/conversation').get(getConversationHistory).post(saveConversation);
router.route('/advice').post(getFinancialAdvice);

module.exports = router;