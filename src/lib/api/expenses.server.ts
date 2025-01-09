import { BACKEND_API_URL } from "$env/static/private";

export async function fetchRecentTransactions() {
    const response = await fetch(`${BACKEND_API_URL}/api/v1/expenses?limit=3`);
    if (!response.ok) {
        throw new Error('Failed to fetch recent transactions');
    }
    return response.json();
}