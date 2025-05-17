// utils/calculateBudget.js
const calculateBudget = (income, allocation, monthlyExpenses, dailyExpenses) => {
    // Calculate amounts based on allocation percentages
    const amounts = {
        savings: Math.round((income * allocation.savings) / 100),
        needs: Math.round((income * allocation.needs) / 100),
        wants: Math.round((income * allocation.wants) / 100),
    };

    // Calculate total monthly expenses
    const totalMonthlyExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const now = new Date();
        return now.toISOString().split('T')[0];
    };

    // Get current month's expenses
    const getCurrentMonthExpenses = () => {
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
        const currentYear = now.getFullYear();

        return dailyExpenses.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() + 1 === currentMonth && expenseDate.getFullYear() === currentYear;
        });
    };

    // Calculate total spent this month
    const currentMonthExpenses = getCurrentMonthExpenses();
    const totalDailyExpensesThisMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate total spent today
    const getTodayExpenses = () => {
        const today = getCurrentDate();
        return dailyExpenses.filter((expense) => expense.date === today);
    };

    const todayExpenses = getTodayExpenses();
    const totalSpentToday = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate remaining budget for the month
    const totalBudget = amounts.needs + amounts.wants;
    const totalSpent = totalMonthlyExpenses + totalDailyExpensesThisMonth;
    const remainingBudget = totalBudget - totalSpent;

    // Calculate daily budget
    const getDaysInMonth = () => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    };

    const getDaysRemainingInMonth = () => {
        const now = new Date();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        return lastDay - now.getDate() + 1; // Include today
    };

    const dailyBudget = remainingBudget / getDaysRemainingInMonth();

    // Calculate yearly projections
    const monthlySavings =
        amounts.savings - (totalSpent > amounts.needs + amounts.wants ? totalSpent - (amounts.needs + amounts.wants) : 0);
    const yearlyProjection = monthlySavings * 12;

    // Calculate finance score (0-100)
    const financeScore = Math.min(
        100,
        Math.max(
            0,
            Math.round(
                (monthlySavings > 0 ? 70 : 50) + (totalSpent < income ? 20 : -10) + (totalSpent < totalBudget ? 10 : -20)
            )
        )
    );

    return {
        amounts,
        totalMonthlyExpenses,
        totalDailyExpensesThisMonth,
        totalSpentToday,
        remainingBudget,
        dailyBudget,
        monthlySavings,
        yearlyProjection,
        financeScore,
        totalBudget,
        totalSpent,
        daysRemainingInMonth: getDaysRemainingInMonth(),
    };
};

module.exports = { calculateBudget };