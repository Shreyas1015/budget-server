// controllers/dashboardController.js
const asyncHandler = require('express-async-handler');
const Income = require('../models/Income');
const Allocation = require('../models/Allocation');
const MonthlyExpense = require('../models/MonthlyExpense');
const DailyExpense = require('../models/DailyExpense');
const Goal = require('../models/Goal');
const { calculateBudget } = require('../utils/calculateBudget');

// @desc    Get all dashboard data
// @route   GET /api/dashboard
// @access  Public
const getDashboardData = asyncHandler(async (req, res) => {
    try {
        // Get latest income and allocation
        const income = await Income.findOne().sort({ createdAt: -1 });
        const allocation = await Allocation.findOne().sort({ createdAt: -1 });

        // Get expenses
        const monthlyExpenses = await MonthlyExpense.find({});
        const dailyExpenses = await DailyExpense.find({});

        // Get goals
        const goals = await Goal.find({});

        // Calculate budget metrics
        const budgetData = calculateBudget(
            income ? income.amount : 40000,
            allocation ? allocation : { savings: 30, needs: 50, wants: 20 },
            monthlyExpenses,
            dailyExpenses
        );

        // Format allocation data for pie chart
        const allocationData = [
            {
                name: "Savings",
                population: budgetData.amounts.savings,
                color: "#3b82f6",
                legendFontColor: "#333",
                legendFontSize: 12
            },
            {
                name: "Needs",
                population: budgetData.amounts.needs,
                color: "#22c55e",
                legendFontColor: "#333",
                legendFontSize: 12
            },
            {
                name: "Wants",
                population: budgetData.amounts.wants,
                color: "#f59e0b",
                legendFontColor: "#333",
                legendFontSize: 12
            }
        ];

        // Ensure all required fields are present with default values
        const responseData = {
            income: income ? income.amount : 40000,
            allocation: allocation ? allocation : { savings: 30, needs: 50, wants: 20 },
            goals: goals || [],
            monthlyExpenses: monthlyExpenses || [],
            dailyExpenses: dailyExpenses || [],
            allocationData,
            amounts: budgetData.amounts || { savings: 0, needs: 0, wants: 0 },
            totalMonthlyExpenses: budgetData.totalMonthlyExpenses || 0,
            totalDailyExpensesThisMonth: budgetData.totalDailyExpensesThisMonth || 0,
            totalSpentToday: budgetData.totalSpentToday || 0,
            remainingBudget: budgetData.remainingBudget || 0,
            dailyBudget: budgetData.dailyBudget || 0,
            monthlySavings: budgetData.monthlySavings || 0,
            yearlyProjection: budgetData.yearlyProjection || 0,
            totalBudget: budgetData.totalBudget || 0,
            daysRemainingInMonth: budgetData.daysRemainingInMonth || 0
        };

        res.json(responseData);
    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({
            message: 'Failed to fetch dashboard data',
            error: error.message
        });
    }
});

// @desc    Get financial summary
// @route   GET /api/dashboard/summary
// @access  Public
const getFinancialSummary = asyncHandler(async (req, res) => {
    // Get latest income and allocation
    const income = await Income.findOne().sort({ createdAt: -1 });
    const allocation = await Allocation.findOne().sort({ createdAt: -1 });

    // Get expenses
    const monthlyExpenses = await MonthlyExpense.find({});
    const dailyExpenses = await DailyExpense.find({});

    // Calculate budget metrics
    const budgetData = calculateBudget(
        income ? income.amount : 40000,
        allocation ? allocation : { savings: 30, needs: 50, wants: 20 },
        monthlyExpenses,
        dailyExpenses
    );

    res.json({
        income: income ? income.amount : 40000,
        allocation: allocation ? allocation : { savings: 30, needs: 50, wants: 20 },
        totalMonthlyExpenses: budgetData.totalMonthlyExpenses,
        totalDailyExpensesThisMonth: budgetData.totalDailyExpensesThisMonth,
        totalSpentToday: budgetData.totalSpentToday,
        remainingBudget: budgetData.remainingBudget,
        dailyBudget: budgetData.dailyBudget,
        yearlyProjection: budgetData.yearlyProjection,
        financeScore: budgetData.financeScore,
    });
});

// @desc    Get expenses by category
// @route   GET /api/dashboard/expenses-by-category
// @access  Public
const getExpensesByCategory = asyncHandler(async (req, res) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Create date range for the current month
    const startDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
    const lastDay = new Date(currentYear, currentMonth, 0).getDate();
    const endDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${lastDay}`;

    const expenses = await DailyExpense.find({
        date: { $gte: startDate, $lte: endDate },
    });

    // Group expenses by category
    const categories = {};
    expenses.forEach((expense) => {
        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }
        categories[expense.category] += expense.amount;
    });

    // Convert to array format
    const result = Object.entries(categories).map(([name, amount]) => ({
        name,
        amount,
    }));

    res.json(result);
});

// @desc    Get daily spending trend data
// @route   GET /api/dashboard/daily-trend
// @access  Public
const getDailyTrendData = asyncHandler(async (req, res) => {
    const data = [];

    // Get latest income and allocation for daily budget calculation
    const income = await Income.findOne().sort({ createdAt: -1 });
    const allocation = await Allocation.findOne().sort({ createdAt: -1 });
    const monthlyExpenses = await MonthlyExpense.find({});

    // Calculate budget metrics to get daily budget
    const budgetData = calculateBudget(
        income ? income.amount : 40000,
        allocation ? allocation : { savings: 30, needs: 50, wants: 20 },
        monthlyExpenses,
        []
    );

    // Get data for the last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayExpenses = await DailyExpense.find({ date: dateStr });
        const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        data.push({
            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
            amount: total,
            date: dateStr,
            budget: budgetData.dailyBudget,
        });
    }

    res.json(data);
});

// @desc    Get monthly savings projection data
// @route   GET /api/dashboard/monthly-projection
// @access  Public
const getMonthlyProjectionData = asyncHandler(async (req, res) => {
    // Get latest income and allocation
    const income = await Income.findOne().sort({ createdAt: -1 });
    const allocation = await Allocation.findOne().sort({ createdAt: -1 });

    // Get expenses
    const monthlyExpenses = await MonthlyExpense.find({});
    const dailyExpenses = await DailyExpense.find({});

    // Calculate budget metrics
    const budgetData = calculateBudget(
        income ? income.amount : 40000,
        allocation ? allocation : { savings: 30, needs: 50, wants: 20 },
        monthlyExpenses,
        dailyExpenses
    );

    const data = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Generate projection for next 12 months
    for (let i = 0; i < 12; i++) {
        const month = (currentMonth + i) % 12;
        const year = currentYear + Math.floor((currentMonth + i) / 12);
        const date = new Date(year, month, 1);

        data.push({
            name: date.toLocaleDateString('en-US', { month: 'short' }),
            projected: budgetData.monthlySavings,
            accumulated: budgetData.monthlySavings * (i + 1),
        });
    }

    res.json(data);
});

module.exports = {
    getDashboardData,
    getFinancialSummary,
    getExpensesByCategory,
    getDailyTrendData,
    getMonthlyProjectionData,
};