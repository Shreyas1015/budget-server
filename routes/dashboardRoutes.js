// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const {
    getDashboardData,
    getFinancialSummary,
    getExpensesByCategory,
    getDailyTrendData,
    getMonthlyProjectionData,
} = require('../controllers/dashboardController');

router.route('/').get(getDashboardData);
router.route('/summary').get(getFinancialSummary);
router.route('/expenses-by-category').get(getExpensesByCategory);
router.route('/daily-trend').get(getDailyTrendData);
router.route('/monthly-projection').get(getMonthlyProjectionData);

module.exports = router;