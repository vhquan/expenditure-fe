import { BACKEND_API_URL } from '$env/static/private';

export async function fetchCategories() {
    const response = await fetch(`${BACKEND_API_URL}/api/v1/categories`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return response.json();
}