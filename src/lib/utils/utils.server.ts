import { type Expense, type Totals } from "$lib/types/expense";

export function getTotals(expenses: Expense[], period: 'daily' | 'weekly' | 'monthly'): Totals {
    const now = new Date();
    let startDate: Date;

    switch (period) {
        case 'daily':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'weekly':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
            break;
        case 'monthly':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        default:
            throw new Error('Invalid period');
    }

    const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate < new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    });

    let income = 0;
    let expenseTotal = 0;
    let categoryExpenses: { [categoryName: string]: number } = {};

    filteredExpenses.forEach(exp => {
        if (exp.type == 'income') {
            income += exp.amount;
        } else if (exp.type == 'expense') {
            expenseTotal += exp.amount;
            const categoryName = exp.category.name;
            if (categoryExpenses[categoryName]) {
                categoryExpenses[categoryName] += exp.amount;
            } else {
                categoryExpenses[categoryName] = exp.amount;
            }
        }
    });

    return { income, expense: expenseTotal, categoryExpenses };
}