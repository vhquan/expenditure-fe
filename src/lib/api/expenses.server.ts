import { BACKEND_API_URL } from "$env/static/private";

export async function fetchRecentTransactions() {
    const response = await fetch(`${BACKEND_API_URL}/api/v1/expenses?limit=5`);
    if (!response.ok) {
        throw new Error('Failed to fetch recent transactions');
    }
    return response.json();
}

export async function fetchAllExpenses() {
    const response = await fetch(`${BACKEND_API_URL}/api/v1/expenses`);
    if (!response.ok) {
        throw new Error('Failed to fetch expeneses');
    }
    return response.json();
}