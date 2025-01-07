import { BACKEND_API_URL } from '$env/static/private';
import { fetchCategories } from '$lib/api/categories.server';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // Fetch categories from the backend
    const categories = await fetchCategories();
    return {
        categories,
    };
};

export const actions: Actions = {
    // Handle expense form submission
    createExpense: async ({ request }) => {
        const formData = await request.formData();

        const expense = {
            type: formData.get('type'),
            amount: parseFloat(formData.get('amount') as string),
            description: formData.get('description'),
            date: formData.get('date'),
            category: formData.get('category'),
        };

        // Validate required fields
        if (!expense.type || !expense.amount || !expense.date || !expense.category) {
            return fail(400, { error: 'All fields are required', expense });
        }

        try {
            // Send the expense data to the backend
            const response = await fetch(`${BACKEND_API_URL}/api/v1/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expense),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            // Redirect to the home page after successful submission
            throw redirect(303, '/');
        } catch (error) {
            return fail(500, { error: error.message, expense });
        }
    },

    // Handle category creation
    createCategory: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get('name');

        // Validate the category name
        if (!name) {
            return fail(400, { categoryError: 'Category name is required' });
        }

        try {
            // Send the new category data to the backend
            const response = await fetch(`${BACKEND_API_URL}/api/v1/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const newCategory = await response.json();

            // Return the new category to update the UI
            return {
                newCategory,
            };
        } catch (error) {
            return fail(500, { categoryError: error.message });
        }
    },
};