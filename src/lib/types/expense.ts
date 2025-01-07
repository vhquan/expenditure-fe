export interface Category {
    _id: string;
    name: string;
}

export interface Expense {
    type: 'income' | 'expense';
    amount: number;
    description?: string;
    date: string;
    category: string;
}