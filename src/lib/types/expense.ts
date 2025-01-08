export interface Expense {
    type: 'income' | 'expense';
    amount: number;
    description?: string;
    date: string;
    category: string;
}