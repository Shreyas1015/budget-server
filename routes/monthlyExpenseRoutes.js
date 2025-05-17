// routes/monthlyExpenseRoutes.js
const express = require('express');
const router = express.Router();
const {
    getMonthlyExpenses,
    addMonthlyExpense,
    deleteMonthlyExpense,
} = require('../controllers/monthlyExpenseController');

router.route('/').get(getMonthlyExpenses).post(addMonthlyExpense);
router.route('/:id').delete(deleteMonthlyExpense);

module.exports = router;