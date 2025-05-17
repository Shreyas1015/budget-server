// utils/generateAdvice.js
const Income = require('../models/Income');
const Allocation = require('../models/Allocation');
const MonthlyExpense = require('../models/MonthlyExpense');
const DailyExpense = require('../models/DailyExpense');
const Goal = require('../models/Goal');
const { calculateBudget } = require('./calculateBudget');

const generateAdvice = async (query) => {
    // Get latest income and allocation
    const income = await Income.findOne().sort({ createdAt: -1 });
    const allocation = await Allocation.findOne().sort({ createdAt: -1 });

    // Get expenses
    const monthlyExpenses = await MonthlyExpense.find({});
    const dailyExpenses = await DailyExpense.find({});

    // Get goals
    const goals = await Goal.find({ selected: true });

    // Calculate budget metrics
    const budgetData = calculateBudget(
        income ? income.amount : 40000,
        allocation ? allocation : { savings: 30, needs: 50, wants: 20 },
        monthlyExpenses,
        dailyExpenses
    );

    // Simple pattern matching for demo purposes
    const lowerQuery = query.toLowerCase();
    let response = '';

    if (lowerQuery.includes('how did i do')) {
        response = `Based on your financial data, you're ${budgetData.remainingBudget >= 0 ? "doing well" : "facing some challenges"}! 
    
Your monthly income is ₹${(income ? income.amount : 40000).toLocaleString("en-IN")} and you've spent ₹${(budgetData.totalMonthlyExpenses + budgetData.totalDailyExpensesThisMonth).toLocaleString("en-IN")} so far this month. 

Today, you've spent ₹${budgetData.totalSpentToday.toLocaleString("en-IN")} out of your daily budget of ₹${Math.round(budgetData.dailyBudget).toLocaleString("en-IN")}.

Your remaining budget for this month is ${budgetData.remainingBudget >= 0 ? "₹" + budgetData.remainingBudget.toLocaleString("en-IN") : "overspent by ₹" + Math.abs(budgetData.remainingBudget).toLocaleString("en-IN")}.`;
    } else if (lowerQuery.includes('save more')) {
        const topExpenseCategory = dailyExpenses.reduce((acc, expense) => {
            if (!acc[expense.category]) {
                acc[expense.category] = 0;
            }
            acc[expense.category] += expense.amount;
            return acc;
        }, {});

        const sortedCategories = Object.entries(topExpenseCategory).sort((a, b) => b[1] - a[1]);
        const topCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : "discretionary spending";

        response = `Looking at your expenses, I notice you're spending a lot on ${topCategory}. Try reducing this by 20% next month.

Also, consider these strategies:

1. Automate your savings by setting up an automatic transfer on payday
2. Follow the 24-hour rule for non-essential purchases over ₹1,000
3. Look for subscriptions you can cancel or share with family
4. Try meal planning to reduce food expenses

If you can increase your monthly savings by ₹3,000, you'll add ₹36,000 to your yearly savings!`;
    } else if (lowerQuery.includes('goals') || lowerQuery.includes('house')) {
        if (goals.length > 0) {
            const goalDetails = goals
                .map((goal) => {
                    const monthsToGoal = Number.parseInt(goal.timeline) * 12;
                    const monthlyContribution = (goal.amount - goal.current) / monthsToGoal;

                    return `For your "${goal.name}" goal (₹${goal.amount.toLocaleString("en-IN")}), you've saved ₹${goal.current.toLocaleString("en-IN")} (${Math.round((goal.current / goal.amount) * 100)}%). 
        
You need to save approximately ₹${Math.round(monthlyContribution).toLocaleString("en-IN")} monthly to reach this goal in ${goal.timeline}.`;
                })
                .join("\n\n");

            response = goalDetails;
        } else {
            response =
                "You don't have any active goals set up yet. Go to the Goals section to set up your financial goals, and I can help you track your progress toward them.";
        }
    } else if (lowerQuery.includes('budget')) {
        response = `Your current budget allocation is:

• Savings: ${allocation ? allocation.savings : 30}% (₹${budgetData.amounts.savings.toLocaleString("en-IN")})
• Needs: ${allocation ? allocation.needs : 50}% (₹${budgetData.amounts.needs.toLocaleString("en-IN")})
• Wants: ${allocation ? allocation.wants : 20}% (₹${budgetData.amounts.wants.toLocaleString("en-IN")})

So far this month, you've spent:
• Monthly bills: ₹${budgetData.totalMonthlyExpenses.toLocaleString("en-IN")}
• Daily expenses: ₹${budgetData.totalDailyExpensesThisMonth.toLocaleString("en-IN")}

Your remaining budget is ${budgetData.remainingBudget >= 0 ? "₹" + budgetData.remainingBudget.toLocaleString("en-IN") : "overspent by ₹" + Math.abs(budgetData.remainingBudget).toLocaleString("en-IN")}.

Your daily budget for the rest of the month is ₹${Math.round(budgetData.dailyBudget).toLocaleString("en-IN")}.`;
    } else if (lowerQuery.includes('projection') || lowerQuery.includes('future')) {
        response = `Based on your current savings rate, here's your financial projection:

Monthly savings: ₹${budgetData.monthlySavings.toLocaleString("en-IN")}
Yearly projection: ₹${budgetData.yearlyProjection.toLocaleString("en-IN")}

In 5 years, you could save approximately ₹${(budgetData.yearlyProjection * 5).toLocaleString("en-IN")}.
In 10 years, you could save approximately ₹${(budgetData.yearlyProjection * 10).toLocaleString("en-IN")}.

This doesn't account for investment returns, which could significantly increase these amounts. Consider investing your savings for long-term growth.`;
    } else {
        response = `Based on your financial data, here's a quick summary:

Income: ₹${(income ? income.amount : 40000).toLocaleString("en-IN")} monthly
Savings allocation: ₹${budgetData.amounts.savings.toLocaleString("en-IN")} (${allocation ? allocation.savings : 30}%)
Expenses this month: ₹${(budgetData.totalMonthlyExpenses + budgetData.totalDailyExpensesThisMonth).toLocaleString("en-IN")}
Remaining budget: ${budgetData.remainingBudget >= 0 ? "₹" + budgetData.remainingBudget.toLocaleString("en-IN") : "overspent by ₹" + Math.abs(budgetData.remainingBudget).toLocaleString("en-IN")}

You can ask me specific questions about your budget, goals, savings projections, or how to save more money.`;
    }

    return response;
};

module.exports = { generateAdvice };