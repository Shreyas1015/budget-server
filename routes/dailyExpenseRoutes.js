// routes/dailyExpenseRoutes.js
const express = require('express');
const router = express.Router();
const {
    getDailyExpenses,
    getDailyExpensesByDate,
    getDailyExpensesByMonth,
    addDailyExpense,
    deleteDailyExpense,
} = require('../controllers/dailyExpenseController');

router.route('/').get(getDailyExpenses).post(addDailyExpense);
router.route('/date/:date').get(getDailyExpensesByDate);
router.route('/month/:year/:month').get(getDailyExpensesByMonth);
router.route('/:id').delete(deleteDailyExpense);

module.exports = router;