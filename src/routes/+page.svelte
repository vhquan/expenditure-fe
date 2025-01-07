<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';

    export let data: PageData;
    export let form;

    let expense = {
        type: form?.expense?.type || 'expense',
        amount: form?.expense?.amount || 0,
        description: form?.expense?.description || '',
        date: form?.expense?.date || new Date().toISOString().split('T')[0],
        category: form?.expense?.category || '',
    };

    let selectedCategory = form?.expense?.category || '';
</script>

<style>
    .form-container {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
    }
    .form-group {
        margin-bottom: 15px;
    }
    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }
    input, select, button {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    button {
        background-color: #007bff;
        color: white;
        cursor: pointer;
    }
    button:hover {
        background-color: #0056b3;
    }
    .error {
        color: red;
        margin-top: 10px;
    }
</style>

<div class="form-container">
    <h2>Add Expense</h2>
    <form method="POST" use:enhance>
        <div class="form-group">
            <label for="type">Type</label>
            <select id="type" name="type" bind:value={expense.type}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>
        </div>

        <div class="form-group">
            <label for="amount">Amount</label>
            <input
                id="amount"
                type="number"
                name="amount"
                bind:value={expense.amount}
                min="0"
                step="0.01"
                required
            />
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <input
                id="description"
                type="text"
                name="description"
                bind:value={expense.description}
                placeholder="Enter a description"
            />
        </div>

        <div class="form-group">
            <label for="date">Date</label>
            <input
                id="date"
                type="date"
                name="date"
                bind:value={expense.date}
                required
            />
        </div>

        <div class="form-group">
            <label for="category">Category</label>
            <select id="category" name="category" bind:value={selectedCategory} required>
                <option value="">Select a category</option>
                {#each data.categories as category}
                    <option value={category._id}>{category.name}</option>
                {/each}
            </select>
        </div>

        <button type="submit">Add Expense</button>
    </form>

    {#if form?.error}
        <p class="error">{form.error}</p>
    {/if}
</div>