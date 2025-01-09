import { type Category } from "./category";

export interface Expense {
    type: 'income' | 'expense';
    amount: number;
    description?: string;
    date: string;
    category: Category;
}

export interface Totals {
    income: number;
    expense: number;
    categoryExpenses: { [categoryName: string]: number };
}