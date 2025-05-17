// routes/incomeRoutes.js
const express = require('express');
const router = express.Router();
const { getIncome, updateIncome } = require('../controllers/incomeController');

router.route('/').get(getIncome).post(updateIncome);

module.exports = router;